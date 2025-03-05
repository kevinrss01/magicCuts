import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { DetectedSegments } from "~/utils/types/supabase";

interface VideoSegmentCardProps {
  segment: DetectedSegments;
}

export function VideoSegmentCard({ segment }: VideoSegmentCardProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const duration = segment.end - segment.start;

  const handleDownload = () => {
    if (!segment.filePath) return;

    // Create a temporary anchor element to trigger download
    const a = document.createElement("a");
    a.href = segment.filePath;
    a.download = `segment-${segment.rank}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card className="w-full">
      <CardBody className="flex flex-row gap-4 p-4">
        <div className="relative w-[240px] flex-shrink-0">
          <div className="relative">
            <video
              className="w-full h-[426px] rounded-lg object-cover bg-black"
              src={segment.filePath}
              controls
              preload="auto"
              onError={(e) => console.error("Error loading video:", e)}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex items-center justify-center w-20 h-16 text-4xl font-bold text-primary bg-primary/10 rounded-lg">
              #{segment.rank}
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold mb-2">Viral Potential</p>
              <p className="text-default-500">{segment.reason}</p>
            </div>
          </div>
          <div className="mt-auto">
            <div className="flex gap-2 text-small text-default-500 mb-3">
              <span>Start: {formatTime(segment.start)}</span>
              <span>•</span>
              <span>End: {formatTime(segment.end)}</span>
              <span>•</span>
              <span>Duration: {formatTime(duration)} seconds</span>
            </div>
            <Button
              color="primary"
              startContent={<Icon icon="lucide:download" width={18} />}
              onPress={handleDownload}
              className="w-full"
              isDisabled={!segment.filePath}
            >
              Download video
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
