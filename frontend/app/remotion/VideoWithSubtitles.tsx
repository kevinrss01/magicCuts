import React from "react";
import { AbsoluteFill, Video } from "remotion";

interface VideoWithSubtitlesProps {
  videoUrl: string;
  subtitleText: string;
}

export const VideoWithSubtitles: React.FC<any> = ({
  videoUrl,
  subtitleText,
}) => {
  return (
    <AbsoluteFill>
      <Video src={videoUrl} startFrom={0} />

      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 100,
        }}
      >
        <div
          style={{
            fontSize: 40,
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "8px 16px",
            borderRadius: 8,
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          {subtitleText}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
