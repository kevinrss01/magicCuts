import { UserData } from "~/utils/types/user";
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
        userData: UserData;
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
        userInfo: UserData;
      }
    >(formatSuffix("callback"), {
      accessToken: accessToken,
    });
  }
}
