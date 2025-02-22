export interface Models {
  gpt4Turbo: OpenAIModel;
  gpt4: OpenAIModel;
  gpt3Turbo: OpenAIModel;
  gpt3_16k: OpenAIModel;
  gpt4o: OpenAIModel;
  gpt4oMini: OpenAIModel;
  o1: OpenAIModel;
  o1Mini: OpenAIModel;
  o3Mini: OpenAIModel;
}

export type OpenAIModel =
  | "gpt-4-turbo"
  | "gpt-4"
  | "gpt-3.5-turbo-0125"
  | "gpt-3.5-turbo-16k"
  | "gpt-4o"
  | "gpt-4o-mini"
  | "o1-mini"
  | "o1"
  | "o3-mini";

export interface DetectedSegments {
  rank: number;
  start: number;
  end: number;
  reason: string;
  filePath?: string;
}
