import * as crypto from "crypto";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import type { DetectedSegments } from "../types/openai";

// This interface is for the input object containing all segments
interface SegmentsInput {
  segments: DetectedSegments[];
}

export class FfmpegService {
  constructor() {
    //
  }

  async cutAndTransformSegments(
    segmentsData: SegmentsInput,
    originalVideoPath: string,
  ): Promise<DetectedSegments[]> {
    const sortedSegments = [...segmentsData.segments].sort(
      (a, b) => a.rank - b.rank,
    );

    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const segmentPromises = sortedSegments.map((segment) => {
      const uniqueId = crypto.randomUUID();
      const outputFileName = `segment_${segment.rank}_${uniqueId}.mp4`;
      const outputPath = path.join(tempDir, outputFileName);

      const segmentDuration = segment.end - segment.start;

      return new Promise<DetectedSegments>((resolve, reject) => {
        // Use fluent-ffmpeg to cut and convert
        ffmpeg(originalVideoPath)
          .setStartTime(segment.start)
          .setDuration(segmentDuration)
          .videoFilters([
            // 1) Crop: conserver la hauteur, rogner la largeur pour 9:16
            "crop='ih*(9/16)':ih:(iw - ih*(9/16))/2:0",
            // 2) Resize final en 1080×1920
            "scale=1080:1920",
          ])
          .outputOptions("-c:a copy") // Keep original audio
          .on("end", () => {
            // Once processing is done, we add filePath to the segment
            console.log("new segment", {
              ...segment,
              filePath: outputPath,
            });
            resolve({
              ...segment,
              filePath: outputPath,
            });
          })
          .on("error", (err) => {
            reject(err);
          })
          .save(outputPath);
      });
    });

    const segments: DetectedSegments[] = [];

    //promise all is too greedy, so we use a for loop
    for (const segment of segmentPromises) {
      segments.push(await segment);
    }

    console.log(segments);

    return segments;
  }
}
