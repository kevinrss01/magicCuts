"use client";

import { useState, ChangeEvent } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Spinner,
  Select,
  SelectItem,
} from "@heroui/react";
import { useAuthStore } from "../../app/stores/authStore";
import { ProjectAPI } from "../../utils/services/api/ProjectApi";
import { ProjectDocument } from "~/utils/types/supabase";
import { toastMsg } from "~/utils/toasts";

// Time options for the segments
const TIME_OPTIONS = [
  { value: "15-30seconds", label: "15-30 seconds (recommended)" },
  { value: "30-60seconds", label: "30-60 seconds" },
  { value: "60-90seconds", label: "1-1.5 minutes" },
  { value: "90-120seconds", label: "1.5-2 minutes" },
  { value: "120-180seconds", label: "2-3 minutes" },
];

export const FileUploader: React.FC = () => {
  // State for file upload
  const [dragging, setDragging] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showProcessingMessage, setShowProcessingMessage] =
    useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Get user data and projects update function from auth store
  const { userData, userProjects, setUserProjects } = useAuthStore();

  // Handle drag events
  const handleDragIn = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragOut = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Check file constraints
  const checkFileConstraints = async (
    file: File,
  ): Promise<{ isValid: boolean; error?: string }> => {
    // Check if user has tokens
    if (!userData?.is_premium && (userData?.tokens || 0) <= 0) {
      return {
        isValid: false,
        error:
          "You don't have any tokens left. Please upgrade to premium or purchase more tokens.",
      };
    }

    // Check file size - 1GB for premium users, 500MB for regular users
    const maxSize = userData?.is_premium
      ? 1024 * 1024 * 1024 // 1GB for premium users
      : 500 * 1024 * 1024; // 500MB for regular users

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: userData?.is_premium
          ? "File size must be less than 1 GB"
          : "File size must be less than 500 MB. Upgrade to premium to upload files up to 1 GB.",
      };
    }

    // Check file type
    if (!file.type.startsWith("video/")) {
      return {
        isValid: false,
        error: "Only video files are supported",
      };
    }

    // Check video duration
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;

        if (duration > 1800) {
          resolve({
            isValid: false,
            error: "Video duration must be less than 30 minutes",
          });
        }

        resolve({ isValid: true });
      };

      video.onerror = () => {
        resolve({
          isValid: false,
          error: "Error reading video file",
        });
      };

      video.src = URL.createObjectURL(file);
    });
  };

  // Handle file drop
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const validation = await checkFileConstraints(files[0]);
      if (!validation.isValid) {
        setError(validation.error || "Invalid video file");
        return;
      }
      setFile(files[0]);
    }
  };

  // Handle file input change
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const validation = await checkFileConstraints(e.target.files[0]);
      if (!validation.isValid) {
        setError(validation.error || "Invalid video file");
        return;
      }
      setFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setError("No file selected");
      return;
    }

    if (!selectedTime) {
      setError("Please select a segment time length");
      return;
    }

    if (!userData) {
      setError("You must be logged in to upload files");
      return;
    }

    // Check if user has tokens
    if (!userData.is_premium && userData.tokens <= 0) {
      setError(
        "You don't have any tokens left. Please upgrade to premium or purchase more tokens.",
      );
      return;
    }

    setIsUploading(true);
    setError(null);

    // Show processing message after a short delay
    const processingTimer = setTimeout(() => {
      setShowProcessingMessage(true);
    }, 2000);

    try {
      // Create a unique project ID
      const projectId = crypto.randomUUID();

      // Create FormData object
      const formData = new FormData();
      formData.append("video", file);
      formData.append("projectId", projectId);
      formData.append("timeRequested", selectedTime);
      formData.append("name", file.name);

      const pendingProject: ProjectDocument = {
        id: projectId,
        user_id: userData.id,
        original_video_url: "",
        detected_segments: [],
        state: "pending" as const,
        name: file.name,
        createdDate: new Date().toISOString(),
      };

      setUserProjects([...userProjects, pendingProject]);

      // Don't await the API call, let it run in the background
      ProjectAPI.createProject(formData).catch((error) => {
        console.error("Project creation failed:", error);
        // Optional: Update the project state to failed if needed
        // This would require finding the project in the state and updating it
      });

      userData.tokens -= 1;

      // Reset states immediately
      setFile(null);
      setSelectedTime("");
      setError(null);
      toastMsg.success(
        "Video uploaded successfully, please wait for the process to finish.",
      );
    } catch (error) {
      console.error("Upload initialization failed:", error);

      // Handle different types of errors
      if (error instanceof Error) {
        setError(`Upload failed: ${error.message}`);
      } else {
        setError("Upload failed. Please try again later.");
      }
    } finally {
      clearTimeout(processingTimer);
      setIsUploading(false);
      setShowProcessingMessage(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Import a video to transform into a viral short
      </h2>
      <Card className="w-full">
        <CardBody>
          <div
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-all duration-200 ${
              dragging ? "border-primary bg-primary/10" : "border-gray-300"
            } ${isUploading ? "pointer-events-none opacity-70" : ""} 
            hover:border-primary hover:bg-primary/5`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {!isUploading ? (
                  <>
                    <svg
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <div className="space-y-2 text-center">
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        Support for MP4, MOV, AVI videos
                        {userData?.is_premium
                          ? " (max 1 GB)"
                          : " (max 500 MB)"}{" "}
                        <br />
                        {!userData?.is_premium && (
                          <b>
                            Upgrade to premium to upload larger videos up to 1
                            GB
                          </b>
                        )}
                      </p>
                      {file && (
                        <p className="text-sm text-primary font-medium">
                          {file.name}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-full max-w-md flex flex-col items-center justify-center">
                    <Spinner />
                    <p className="mt-2 text-sm text-center text-gray-500">
                      Processing your video...
                    </p>
                    {showProcessingMessage && (
                      <p className="mt-2 text-xs text-center text-gray-400">
                        This may take a few seconds depending on the size and
                        length of your video
                      </p>
                    )}
                  </div>
                )}
              </div>
              <input
                id="dropzone-file"
                type="file"
                accept="video/mp4,video/x-m4v,video/quicktime,video/avi"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Time segment selector */}
          <div className="mt-4">
            <Select
              label="Select segment time length"
              placeholder="Choose desired segment length"
              selectedKeys={selectedTime ? [selectedTime] : []}
              onChange={(e) => setSelectedTime(e.target.value)}
              isRequired
              isDisabled={isUploading}
              color="primary"
              variant="bordered"
              className="w-full"
              errorMessage={
                !selectedTime && error ? "Time selection is required" : ""
              }
            >
              {TIME_OPTIONS.map((option) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>

          <Button
            color="primary"
            className="mt-4 w-full transition-transform duration-200 hover:scale-[1.02]"
            onPress={handleUpload}
            isDisabled={!file || !selectedTime || isUploading}
          >
            Get my viral shorts
          </Button>
        </CardBody>
      </Card>

      {/* Available tokens display */}
      <div className="mt-4 text-sm flex items-center justify-between p-3 bg-default-50 rounded-lg border border-default-200">
        <div className="flex items-center gap-2">
          <span>Available tokens:</span>
          <strong
            className={
              (userData?.tokens || 0) === 0
                ? "text-red-500 font-bold"
                : "text-primary font-bold"
            }
          >
            {userData?.tokens || 0}
          </strong>
          {(userData?.tokens || 0) === 0 && (
            <span className="text-red-500 text-xs animate-pulse">
              No tokens left!
            </span>
          )}
        </div>
        <span className="text-xs bg-default-100 px-2 rounded-md">
          Each upload uses 1 token
        </span>
      </div>
      <div className="pt-4">
        {error && (
          <Alert
            color="danger"
            title="Error"
            description={error}
            variant="flat"
            onClose={() => setError(null)}
          />
        )}
      </div>
    </div>
  );
};

export default FileUploader;
