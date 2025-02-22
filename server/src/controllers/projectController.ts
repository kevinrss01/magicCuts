import type { Context } from "hono";
import { ProjectService } from "../services/projectService";
import { HTTPException } from "hono/http-exception";

export class ProjectController {
  constructor() {
    //
  }

  async createProject(c: Context) {
    try {
      console.log("createProject");
      if (!c.req || !c.req?.formData) {
        console.error("No request provided.");
        throw new HTTPException(400, {
          message: "No request provided.",
        });
      }

      const formData = await c.req.formData();

      if (!formData) {
        console.error("No form data provided.");
        throw new HTTPException(400, {
          message: "No form data provided.",
        });
      }

      const video = formData.get("video");
      const payload = c.get("jwtPayload");
      const projectId = formData.get("projectId");

      if (!projectId || typeof projectId !== "string") {
        console.error("No projectId provided.");
        throw new HTTPException(400, {
          message: "No projectId provided.",
        });
      }

      if (!payload || !payload.user) {
        console.error("No payload provided.");
        throw new HTTPException(400, {
          message: "No payload provided.",
        });
      }

      if (!video || typeof video === "string") {
        console.error("No video uploaded or invalid video.");
        throw new HTTPException(400, {
          message: "No video uploaded or invalid video.",
        });
      }

      // Cast the file to a File type
      const uploadedVideo = video as File;

      // Verify the file is a video file by checking its MIME type
      if (!uploadedVideo.type || !uploadedVideo.type.startsWith("video/")) {
        console.error("Uploaded video is not a video file.");
        throw new HTTPException(400, {
          message: "Uploaded video is not a video file.",
        });
      }

      if (uploadedVideo.size > 1_073_741_824) {
        console.error("Video exceeds maximum allowed size (1 GB).");
        throw new HTTPException(400, {
          message: "Video exceeds maximum allowed size (1 GB).",
        });
      }

      const projectService = new ProjectService();
      const fileExtension = uploadedVideo.name.split(".").pop();

      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const timeRequested = formData.get("timeRequested");

      if (!timeRequested || typeof timeRequested !== "string") {
        console.error("No time requested provided.");
        throw new HTTPException(400, {
          message: "No time requested provided.",
        });
      }

      const res = await projectService.createProject({
        file: uploadedVideo,
        fileName,
        userId: payload.user.id,
        timeRequested: timeRequested,
        projectDocumentId: projectId,
      });

      return res;
    } catch (error) {
      console.error(error);
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(500, {
        message: "Internal server error.",
      });
    }
  }

  async getProject(c: Context) {
    try {
      const userId = c.get("jwtPayload").user.id;
      const body = await c.req.json();
      const projectDocumentId = body.projectDocumentId;

      if (!projectDocumentId || typeof projectDocumentId !== "string") {
        console.error("No projectDocumentId provided.");
        throw new HTTPException(400, {
          message: "No projectDocumentId provided.",
        });
      }

      const projectService = new ProjectService();
      const res = await projectService.getProject({
        userId,
        projectDocumentId: projectDocumentId,
      });
      return res;
    } catch (error) {
      console.error(error);
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(500, {
        message: "Internal server error.",
      });
    }
  }
}
