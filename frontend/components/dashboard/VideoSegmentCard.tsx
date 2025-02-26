import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { DetectedSegments } from "~/utils/types/supabase";

interface VideoSegmentCardProps {
  segment: DetectedSegments;
}

export function VideoSegmentCard({ segment }: VideoSegmentCardProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const duration = segment.end - segment.start;

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.currentTime = segment.start;
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  React.useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => {
        if (video.currentTime >= segment.end) {
          video.pause();
          setIsPlaying(false);
        }
      };

      video.addEventListener("timeupdate", handleTimeUpdate);
      return () => video.removeEventListener("timeupdate", handleTimeUpdate);
    }
  }, [segment.end]);

  return (
    <Card className="w-full">
      <CardBody className="flex flex-row gap-4 p-4">
        <div className="relative w-[240px] flex-shrink-0">
          <video
            ref={videoRef}
            className="w-full h-[426px] rounded-lg object-cover bg-black"
            src={segment.filePath}
            preload="metadata"
          />
          <Button
            isIconOnly
            color="primary"
            className="absolute bottom-4 right-4"
            onPress={handlePlayClick}
          >
            <Icon
              icon={isPlaying ? "lucide:pause" : "lucide:play"}
              width={24}
            />
          </Button>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 text-4xl font-bold text-primary bg-primary/10 rounded-lg">
              #{segment.rank}
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold mb-2">Viral Potential</p>
              <p className="text-default-500">{segment.reason}</p>
            </div>
          </div>
          <div className="mt-auto flex gap-2 text-small text-default-500">
            <span>Start: {formatTime(segment.start)}</span>
            <span>•</span>
            <span>End: {formatTime(segment.end)}</span>
            <span>•</span>
            <span>Duration: {formatTime(duration)}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
