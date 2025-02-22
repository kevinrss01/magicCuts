import dotenv from "dotenv";

dotenv.config();

export const config = {
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_KEY!,
  jwtSecret: process.env.JWT_SECRET!,
  serviceRoleKey: process.env.SERVICE_ROLE_KEY!,
  awsBucketName: process.env.AWS_BUCKET_NAME!,
  awsRegion: process.env.AWS_S3_REGION!,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  deepgramApiKey: process.env.DEEPGRAM_API_KEY!,
  openAiApiKey: process.env.OPEN_AI_API_KEY!,
};
