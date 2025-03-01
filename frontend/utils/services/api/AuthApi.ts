import { ProjectDocument, UserData } from "~/utils/types/supabase";
import AxiosCallApi from "../axios";

const PREFIX = "auth";

const formatSuffix = (suffix: string) => `${PREFIX}/${suffix}`;

export class AuthAPI {
  static async getAuth() {
    return AxiosCallApi.get<{ url: string }>(formatSuffix("google"));
  }

  static async signIn(accessToken: string) {
    return AxiosCallApi.post<
      { accessToken: string },
      {
        accessToken: string;
        userData: {
          userRelativeData: UserData;
          userDocuments: ProjectDocument[];
        };
      }
    >(formatSuffix("signin"), {
      accessToken: accessToken,
    });
  }

  static async callback(accessToken: string) {
    return AxiosCallApi.post<
      { accessToken: string },
      {
        accessToken: string;
        userInfo: {
          userRelativeData: UserData;
          userDocuments: ProjectDocument[];
        };
      }
    >(formatSuffix("callback"), {
      accessToken: accessToken,
    });
  }
}
