import { AwsService } from "./awsService";
import { promises as fsPromises } from "fs";
import { createReadStream } from "fs";
import fs from "fs";
import { TranscriptionService } from "./transcriptionService";
import { PromptService } from "./promptService";
import { models, OpenaiService } from "./openaiService";
import { responseFormat } from "../constants/constants";
import { FfmpegService } from "./ffmpegService";
import type { DetectedSegments } from "../types/openai";
import { HTTPException } from "hono/http-exception";
import {
  createProjectDocument,
  updateProjectDocument,
  getProjectDocument,
  getProjectsByUserId,
} from "./supabaseService";

export class ProjectService {
  constructor() {
    //
  }

  async createProject({
    file,
    fileName,
    userId,
    timeRequested,
    projectDocumentId,
    projectName,
  }: {
    file: File;
    fileName: string;
    userId: string;
    timeRequested: string;
    projectDocumentId: string;
    projectName: string;
  }) {
    const tempFilePath = `temp/${crypto.randomUUID()}-${fileName.replace(
      " ",
      "_",
    )}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let originalUrlVideo = "";

    try {
      await createProjectDocument({
        userId,
        documentId: projectDocumentId,
        projectName,
      });

      await fsPromises.mkdir("temp", { recursive: true });
      await fsPromises.writeFile(tempFilePath, buffer);
      const stream = createReadStream(tempFilePath);
      const awsService = new AwsService();

      const awsFilePath = `magicscuts/${userId}/${crypto.randomUUID()}-${fileName}`;

      originalUrlVideo = await awsService.uploadFileFromStreamToAWS(
        stream,
        awsFilePath,
      );
      console.debug("File uploaded to AWS");
      const transcriptionService = new TranscriptionService();

      const transcription =
        await transcriptionService.transcribeVideo(originalUrlVideo);

      const promptService = new PromptService();

      const prompt = promptService.createPromptForViralSegments({
        stringifiedTranscription: transcription,
        desiredSegmentDuration: timeRequested,
      });

      const openaiService = new OpenaiService();

      const bestSegments = await openaiService.requestToGPT({
        prompt,
        model: models.o3Mini,
        maxTokens: 20000,
        temperature: 0.5,
        responseFormat: "custom",
        customResponseFormat: responseFormat,
      });

      const bestSegmentJSON = JSON.parse(bestSegments) as {
        segments: DetectedSegments[];
      };

      const ffmpegService = new FfmpegService();

      const segments = await ffmpegService.cutAndTransformSegments(
        bestSegmentJSON,
        originalUrlVideo,
      );

      const segmentsWithUrl = await this.saveEachShortInS3(
        segments,
        userId,
        fileName,
      );

      await updateProjectDocument({
        documentId: projectDocumentId,
        detectedSegments: segmentsWithUrl,
        state: "completed",
      });

      return segmentsWithUrl;
    } catch (error) {
      console.error(error);

      await updateProjectDocument({
        documentId: projectDocumentId,
        detectedSegments: [],
        state: "failed",
      });

      if (error instanceof HTTPException) {
        throw error;
      }

      throw new HTTPException(500, {
        message: "Error creating project",
      });
    } finally {
      if (fs.existsSync(tempFilePath)) {
        await fsPromises.unlink(tempFilePath);
      }

      const awsService = new AwsService();
      if (originalUrlVideo) {
        await awsService.deleteFileFromAWS(originalUrlVideo);
      }
    }
  }

  async getProject({
    userId,
    projectDocumentId,
  }: {
    userId: string;
    projectDocumentId: string;
  }) {
    const projectDocument = await getProjectDocument(projectDocumentId);

    if (projectDocument.user_id !== userId) {
      throw new HTTPException(401, {
        message: "Unauthorized access to this project",
      });
    }

    return projectDocument;
  }

  async saveEachShortInS3(
    segments: DetectedSegments[],
    userId: string,
    fileName: string,
  ) {
    const awsService = new AwsService();
    const res = await Promise.all(
      segments.map(async (segment) => {
        if (!segment.filePath) {
          throw new HTTPException(500, {
            message: "Segment file path is missing",
          });
        }
        const stream = createReadStream(segment.filePath);
        const awsFilePath = `magicscuts/${userId}/${crypto.randomUUID()}-${fileName}`;
        const url = await awsService.uploadFileFromStreamToAWS(
          stream,
          awsFilePath,
        );

        if (fs.existsSync(segment.filePath)) {
          await fsPromises.unlink(segment.filePath);
        }

        return {
          ...segment,
          filePath: url,
        };
      }),
    );

    return res;
  }

  async getAllProjects(userId: string) {
    const projects = await getProjectsByUserId(userId);
    return projects;
  }
}
