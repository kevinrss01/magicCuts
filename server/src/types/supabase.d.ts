import { DetectedSegments } from "./openai";

export interface ProjectDocument {
  id: string;
  user_id: string;
  original_video_url: string;
  detected_segments: DetectedSegments[];
  state: "pending" | "completed" | "failed";
  name?: string;
  createdDate?: string;
  tokens: number;
  is_premium: boolean;
}
