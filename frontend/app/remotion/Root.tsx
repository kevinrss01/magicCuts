import { Composition } from "remotion";
import { VideoWithSubtitles } from "./VideoWithSubtitles";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoWithSubtitles"
        component={VideoWithSubtitles}
        durationInFrames={300} // 10 seconds at 30 fps, just for example
        fps={30}
        width={1080} // vertical format example
        height={1920} // vertical format example
      />
    </>
  );
};
