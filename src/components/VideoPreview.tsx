import React from 'react';
import ReactPlayer from 'react-player';

interface VideoPreviewProps {
  videoUrl: string | null;
}

function VideoPreview({ videoUrl }: VideoPreviewProps) {
  return (
    <div className="video-preview-container">
      {videoUrl ? (
        <ReactPlayer url={videoUrl} controls className="video-player" />
      ) : (
        <p>No recap video available yet.</p>
      )}
    </div>
  );
}

export default VideoPreview;
