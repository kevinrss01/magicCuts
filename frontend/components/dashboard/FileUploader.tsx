"use client";

import { useState } from "react";
import { Alert, Button, Card, CardBody, Spinner } from "@heroui/react";
import { useAuthStore } from "../../app/stores/authStore";

export const FileUploader: React.FC = () => {
  // State for file upload
  const [dragging, setDragging] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showProcessingMessage, setShowProcessingMessage] =
    useState<boolean>(false);

  // Get user data from auth store
  const { userData } = useAuthStore();

  // Handle drag events
  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Check file constraints
  const checkFileConstraints = async (
    file: File,
  ): Promise<{ isValid: boolean; error?: string }> => {
    // Check file size (500 MB = 500 * 1024 * 1024 bytes)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "File size must be less than 500 MB",
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
  const handleDrop = async (e: React.DragEvent) => {
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
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!userData) {
      setError("You must be logged in to upload files");
      return;
      return;
    }

    setIsUploading(true);

    try {
      // Mock API call since createProject doesn't exist yet
      // In a real implementation, you would call the actual API with the user's access token
      // const response = await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${userData.accessToken}`
      //   },
      //   body: formData
      // });

      // For now, just simulate a successful upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success
      setError(null);
      setFile(null);

      // Trigger a refresh of the projects list (this would be handled by a global state or context in a real app)
      window.dispatchEvent(new CustomEvent("refreshProjects"));
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Upload failed. Please try again later.");
    } finally {
      clearTimeout(timer);
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
                        Support for MP4, MOV, AVI videos (max 500 MB) <br />
                        <b>Upgrade to to upload longer videos</b>
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
          <Button
            color="primary"
            className="mt-4 w-full transition-transform duration-200 hover:scale-[1.02]"
            onPress={handleUpload}
            isDisabled={!file || isUploading}
          >
            Get my viral shorts
          </Button>
        </CardBody>
      </Card>
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
