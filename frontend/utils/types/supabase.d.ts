export interface UserData {
  id: string;
  email: string;
  name: string;
  avatar: string;
  accessToken: string;
  tokens: number;
  is_premium: boolean;
}

export interface DetectedSegments {
  rank: number;
  start: number;
  end: number;
  reason: string;
  filePath?: string;
}

export interface ProjectDocument {
  id: string;
  user_id: string;
  original_video_url: string;
  detected_segments: DetectedSegments[];
  state: "pending" | "completed" | "failed";
  name?: string;
  createdDate?: string;
}
