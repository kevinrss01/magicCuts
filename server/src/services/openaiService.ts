import OpenAI from "openai";

import { config } from "../config/config";
import type { Models } from "../types/openai";
import type { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";

export const models: Models = {
  gpt4o: "gpt-4o",
  gpt4Turbo: "gpt-4-turbo",
  gpt4: "gpt-4",
  gpt3Turbo: "gpt-3.5-turbo-0125",
  gpt3_16k: "gpt-3.5-turbo-16k",
  gpt4oMini: "gpt-4o-mini",
  o1: "o1",
  o1Mini: "o1-mini",
  o3Mini: "o3-mini",
};

const oModelsWithoutInstructions: string[] = [
  models.o1Mini,
  models.o1,
  models.o3Mini,
];

const oModelsWithAdjustableReasoningEffort: string[] = [
  models.o1,
  models.o3Mini,
];

export class OpenaiService {
  private openAi: OpenAI;

  constructor() {
    this.openAi = new OpenAI({
      apiKey: config.openAiApiKey,
    });
  }

  async requestToGPT({
    prompt,
    maxTokens,
    temperature,
    responseFormat,
    model,
    instructions,
    topP,
    customResponseFormat,
  }: {
    prompt: string;
    maxTokens: number;
    temperature: number;
    responseFormat: "text" | "json_object" | "custom";
    model: string;
    instructions?: string;
    topP?: number;
    customResponseFormat?: any;
  }): Promise<string> {
    console.debug("requestToGPT...");
    if (oModelsWithoutInstructions.includes(model) && instructions) {
      prompt = `${instructions}\n\n-------\n\n${prompt}`;
      instructions = undefined;
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (instructions) {
      messages.push({ role: "system", content: instructions });
    }
    messages.push({ role: "user", content: prompt });

    const params: ChatCompletionCreateParamsNonStreaming = {
      model: model,
      messages: messages,
      response_format:
        responseFormat === "custom"
          ? customResponseFormat
          : { type: responseFormat },
    };

    if (oModelsWithAdjustableReasoningEffort.includes(model)) {
      (params as any).reasoning_effort = "high";
    } else {
      params.max_tokens = maxTokens;
      params.temperature = temperature;
      params.top_p = topP || 1;
      params.presence_penalty = 0;
      params.frequency_penalty = 0;
    }

    try {
      const response = await this.openAi.chat.completions.create(params);

      if (!response.choices?.[0]?.message?.content) {
        throw new Error("Invalid response from OpenAI");
      }

      console.debug("AI job done");

      return response.choices[0].message.content;
    } catch (error: any) {
      throw new Error(`Error with OPEN AI: ${error.message || error}`);
    }
  }
}
