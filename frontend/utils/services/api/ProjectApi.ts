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
}
