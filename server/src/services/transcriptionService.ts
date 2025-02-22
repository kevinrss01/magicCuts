import { createClient, DeepgramClient } from "@deepgram/sdk";

import { config } from "../config/config";
import type { Utterance } from "../types/transcription";

export class TranscriptionService {
  deepgramApiKey: string | null = null;
  deepgramClient: DeepgramClient | null = null;

  constructor() {
    const apiKey = config.deepgramApiKey;

    if (!apiKey) {
      throw new Error("Deepgram API key is not set");
    }

    this.deepgramApiKey = apiKey;
    this.deepgramClient = createClient(apiKey);
  }

  async transcribeVideo(videoUrl: string) {
    console.debug("Transcribing video", videoUrl);
    try {
      const { result, error } =
        await this.deepgramClient!.listen.prerecorded.transcribeUrl(
          { url: videoUrl },
          {
            model: "nova-3",
            detect_language: true,
            smart_format: true,
            punctuate: true,
            paragraphs: true,
            utterances: true,
            diarize: true,
          },
        );

      if (error) {
        throw new Error("Error transcribing video");
      }

      if (!result) {
        throw new Error("No result from transcription");
      }

      console.debug("Transcription done");

      const utterances = result.results.utterances;

      if (!utterances) {
        throw new Error("No utterances from transcription");
      }

      const formattedTranscription = this.formatTranscription(
        utterances as Utterance[],
      );

      return formattedTranscription;
    } catch (error) {
      console.error("Error transcribing video", error);
      throw new Error("Error transcribing video");
    }
  }

  formatTranscription(transcription: Utterance[]): string {
    // Basic validation
    if (!Array.isArray(transcription)) {
      throw new Error(
        "Invalid transcription: expected an array of Utterance objects.",
      );
    }

    const formatted = transcription.map((item) => {
      if (
        typeof item.start !== "number" ||
        typeof item.end !== "number" ||
        typeof item.transcript !== "string" ||
        typeof item.speaker !== "number"
      ) {
        throw new Error(
          `Invalid Utterance object detected: ${JSON.stringify(item)}`,
        );
      }

      return {
        start: item.start,
        end: item.end,
        transcript: item.transcript,
        speaker: item.speaker,
      };
    });

    return JSON.stringify(formatted);
  }
}
