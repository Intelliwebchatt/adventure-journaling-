import React, { useState, useEffect } from 'react';
import VideoPreview from './VideoPreview';
import PublishOptions from './PublishOptions';

function VideoDashboard() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // Placeholder for video URL

  useEffect(() => {
    // In a real scenario, fetch the latest recap video URL from your backend API
    fetchVideoRecap();
  }, []);

  const fetchVideoRecap = async () => {
    // Placeholder for API call to fetch the video recap URL
    // Example: const response = await fetch('/api/recap-video');
    //          const data = await response.json();
    //          setVideoUrl(data.videoUrl);

    // For now, using a dummy video URL
    setVideoUrl('https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_h264.mp4');
  };

  return (
    <div className="dashboard-container">
      <h1>Daily Video Recap Dashboard</h1>
      <VideoPreview videoUrl={videoUrl} />
      <PublishOptions videoUrl={videoUrl} />
    </div>
  );
}

export default VideoDashboard;
