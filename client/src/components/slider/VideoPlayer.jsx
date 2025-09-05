import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ url, active }) => {
  const [ready, setReady] = useState(false);
  const playerRef = useRef(null);

  // Pause when not active to save resources
  useEffect(() => {
    if (!active && playerRef.current) {
      try {
        playerRef.current.getInternalPlayer()?.pause?.();
      } catch {}
    }
  }, [active]);

  return (
    <div className="w-full  flex items-center justify-center relative">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-alt animate-pulse" />
      )}
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={active}
        controls
        width="100%"
        height="100%"
        style={{ maxHeight: "100%" }}
        onReady={() => setReady(true)}
        onError={(e) => {
          setReady(true);
          if (process.env.NODE_ENV === "development")
            console.warn("Video error", e);
        }}
        config={{ file: { attributes: { preload: "metadata" } } }}
      />
    </div>
  );
};

export default VideoPlayer;
