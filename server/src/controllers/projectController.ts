import type { Context } from "hono";
import { ProjectService } from "../services/projectService";
import { HTTPException } from "hono/http-exception";
import { getUserDocument, updateUserTokens } from "../services/supabaseService";

export class ProjectController {
  constructor() {
    //
  }

  async createProject(c: Context) {
    try {
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

      // Verify user has at least one token
      const { tokens } = await getUserDocument(payload.user.email);
      if (tokens < 1) {
        console.error("User does not have enough tokens.");
        throw new HTTPException(403, {
          message:
            "Insufficient tokens. Please purchase more tokens to create a project.",
        });
      }

      // Deduct one token from the user's account
      await updateUserTokens(payload.user.email, 1);
      console.debug(
        `Deducted 1 token from user ${payload.user.email}. Remaining tokens: ${tokens - 1}`,
      );

      if (!video || typeof video === "string") {
        console.error("No video uploaded or invalid video.");
        throw new HTTPException(400, {
          message: "No video uploaded or invalid video.",
        });
      }

      const uploadedVideo = video as File;

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
        projectName:
          (formData.get("name") as string) ||
          uploadedVideo.name.replace(" ", ""),
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

  async getAllProjects(c: Context) {
    try {
      const userId = c.get("jwtPayload").user.id;
      const projectService = new ProjectService();
      const res = await projectService.getAllProjects(userId);
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

  async addSubtitle(c: Context) {
    try {
      //
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
