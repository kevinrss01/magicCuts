import { ProjectDocument } from "~/utils/types/supabase";
import AxiosCallApi from "../axios";

const PREFIX = "projects";

const formatSuffix = (suffix: string) => `${PREFIX}/${suffix}`;

export class ProjectAPI {
  static async getProject(projectDocumentId: string) {
    return AxiosCallApi.post<{ projectDocumentId: string }, ProjectDocument>(
      formatSuffix("getProject"),
      {
        projectDocumentId,
      },
    );
  }

  static async createProject(formData: FormData) {
    return AxiosCallApi.post<FormData, any>(
      formatSuffix("createProject"),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  }

  static async getAllProjects() {
    return AxiosCallApi.post<{}, ProjectDocument[]>(
      formatSuffix("getAllProjects"),
      {},
    );
  }
}
