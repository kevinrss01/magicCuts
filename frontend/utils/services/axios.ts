import axios from "axios";

const baseURLBackEnd =
  import.meta.env.VITE_BASE_URL_BACKEND || process.env.VITE_BASE_URL_BACKEND;

const formatUrl = (baseURL: string, url: string) => {
  console.log("baseURL", baseURL);
  console.log("url", url);

  return `${baseURL}/${url}`;
};
const defaultHeaders = { headers: {}, timeout: 3600000 }; // 1 hour

interface Headers {
  headers: { [key: string]: string | number | undefined };
}

const handleAxiosError = (error: any): never => {
  if (error.response) {
    console.error(error.response);
    throw error.response.data.message;
  } else if (error.request) {
    console.error(error.request);
    throw error.request;
  } else if (error.data) {
    console.error(error.data.message);
    throw error.data.message;
  } else {
    console.error("Error", error.message);
    throw error.message;
  }
};

class AxiosCallApi {
  constructor() {
    if (!baseURLBackEnd) {
      throw new Error("baseURLBackEnd is not defined");
    }
  }

  static async get<T>(url: string, headers?: Headers): Promise<T> {
    try {
      const response = await axios.get<T>(
        formatUrl(baseURLBackEnd, url),
        headers ? headers : defaultHeaders,
      );
      return response.data;
    } catch (error: any) {
      console.error(error?.response ? error.response?.data?.message : error);
      return handleAxiosError(error); // Fix: return handleAxiosError
    }
  }

  static async post<T, R>(url: string, data: T, headers?: Headers): Promise<R> {
    try {
      const response = await axios.post(
        formatUrl(baseURLBackEnd, url),
        data,
        headers ? headers : defaultHeaders,
      );

      return response.data;
    } catch (error: any) {
      console.error(error);
      return handleAxiosError(error);
    }
  }

  static async delete<T, R>(
    url: string,
    data: T,
    headers?: Headers,
  ): Promise<R> {
    try {
      const config = {
        data,
        headers: headers ? headers : {},
      };

      const response = await axios.delete(
        formatUrl(baseURLBackEnd, url),
        config,
      );
      return response.data;
    } catch (error: any) {
      console.error(
        error?.response ? error.response?.constants?.message : error,
      );
      throw new Error(error);
    }
  }

  // static async put<T>(url: string, constants: T, headers: Headers) {
  //   try {
  //     const response = await axios.put(formatUrl(url), constants, headers)
  //     return response.constants
  //   } catch (error: any) {
  //     console.error(error?.response ? error.response?.constants?.message : error)
  //     throw new Error(error)
  //   }
  // }

  static async patch<T, R>(
    url: string,
    data: T,
    headers?: Headers,
  ): Promise<R> {
    try {
      const response = await axios.patch<R>(
        formatUrl(baseURLBackEnd, url),
        data,
        headers ? headers : defaultHeaders,
      );
      return response.data;
    } catch (error: any) {
      return handleAxiosError(error);
    }
  }

  static saveToken(token: any) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
}

export default AxiosCallApi;
