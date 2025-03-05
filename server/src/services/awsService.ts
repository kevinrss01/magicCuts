import {
  HeadObjectCommand,
  S3Client,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { config } from "../config/config";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "stream";

export class AwsService {
  s3client: S3Client;
  s3BucketName: string;
  s3Region: string;
  s3AccessKeyId: string;
  s3SecretAccessKey: string;

  constructor() {
    const s3bucketName = config.awsBucketName;
    const s3Region = config.awsRegion;
    const s3AccessKeyId = config.awsAccessKeyId;
    const s3SecretAccessKey = config.awsSecretAccessKey;

    if (!s3bucketName || !s3Region || !s3AccessKeyId || !s3SecretAccessKey) {
      throw new Error("AWS S3 configuration is missing");
    }

    this.s3BucketName = s3bucketName;
    this.s3Region = s3Region;
    this.s3AccessKeyId = s3AccessKeyId;
    this.s3SecretAccessKey = s3SecretAccessKey;

    this.s3client = new S3Client({
      region: this.s3Region,
    });
  }

  private getExpirationDate(): string {
    //1 year expiration date
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString();
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await this.s3client.send(
        new HeadObjectCommand({
          Bucket: this.s3BucketName,
          Key: filePath,
        }),
      );
      return true;
    } catch (error: any) {
      if (error.name === "NotFound") {
        return false;
      }
      throw error;
    }
  }

  async uploadFileFromStreamToAWS(
    fileStream: Readable,
    filePath: string,
    addContentType: boolean = false,
  ): Promise<string> {
    if (await this.fileExists(filePath)) {
      console.debug("File already exists in AWS S3");
      return `https://${this.s3BucketName}.s3.${this.s3Region}.amazonaws.com/${filePath}`;
    }

    console.debug("Uploading file to AWS");

    return new Promise((resolve, reject) => {
      let fileSize = 0;

      fileStream.on("data", (chunk) => {
        fileSize += chunk.length;
      });

      fileStream.on("end", () => {
        console.debug(`Total file size: ${fileSize} bytes`);
      });

      fileStream.on("error", (error) => {
        console.error("Error in file stream:", error);
        reject(error);
      });

      const uploadParams: {
        Bucket: string;
        Key: string;
        Body: Readable;
        Metadata: Record<string, string>;
        ContentType?: string;
        ContentDisposition?: string;
      } = {
        Bucket: this.s3BucketName,
        Key: filePath,
        Body: fileStream,
        Metadata: {
          "x-amz-meta-expiration-date": this.getExpirationDate(),
        },
      };

      if (filePath.includes(".mp4") && addContentType) {
        const fileName = filePath.split("/").pop();

        uploadParams.ContentType = "video/mp4";
        uploadParams.ContentDisposition =
          'attachment; filename="' + fileName + '"';
      }

      const upload = new Upload({
        client: this.s3client,
        params: uploadParams,
      });

      upload
        .done()
        .then(() => {
          console.debug("File uploaded to AWS S3.");
          resolve(
            `https://${this.s3BucketName}.s3.${this.s3Region}.amazonaws.com/${filePath}`,
          );
        })
        .catch((error) => {
          console.error("Error during upload:", error);
          reject(new Error(`Failed to upload file: ${error.message}`));
        });
    });
  }

  /**
   * Deletes a file from AWS S3 bucket based on its URL
   * @param fileUrl The complete URL of the file to delete
   * @returns A promise that resolves to true if deletion was successful
   */
  async deleteFileFromAWS(fileUrl: string): Promise<boolean> {
    try {
      // Extract the file path from the URL
      // URL format: https://{bucketName}.s3.{region}.amazonaws.com/{filePath}
      const urlPattern = new RegExp(
        `https://${this.s3BucketName}\\.s3\\.${this.s3Region}\\.amazonaws\\.com/(.+)`,
      );
      const match = fileUrl.match(urlPattern);

      if (!match || !match[1]) {
        throw new Error("Invalid file URL format");
      }

      const filePath = match[1];

      // Check if file exists before attempting to delete
      const exists = await this.fileExists(filePath);
      if (!exists) {
        console.debug("File does not exist in AWS S3");
        return false;
      }

      console.debug("Deleting file from AWS S3:", filePath);

      // Send delete command to S3
      await this.s3client.send(
        new DeleteObjectCommand({
          Bucket: this.s3BucketName,
          Key: filePath,
        }),
      );

      console.debug("File successfully deleted from AWS S3");
      return true;
    } catch (error: any) {
      console.error("Error deleting file from AWS S3:", error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}
