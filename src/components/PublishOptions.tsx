import React from 'react';

interface PublishOptionsProps {
  videoUrl: string | null;
}

function PublishOptions({ videoUrl }: PublishOptionsProps) {
  const handlePublishToYouTube = () => {
    if (videoUrl) {
      // Placeholder for YouTube API integration
      console.log('Publishing to YouTube (placeholder):', videoUrl);
      alert('Publishing to YouTube (placeholder)');
    } else {
      alert('No video available to publish.');
    }
  };

  const handlePublishToTikTok = () => {
    if (videoUrl) {
      // Placeholder for TikTok API integration
      console.log('Publishing to TikTok (placeholder):', videoUrl);
      alert('Publishing to TikTok (placeholder)');
    } else {
      alert('No video available to publish.');
    }
  };

  return (
    <div className="publish-options">
      <button className="publish-button" onClick={handlePublishToYouTube}>
        Publish to YouTube
      </button>
      <button className="publish-button" onClick={handlePublishToTikTok}>
        Publish to TikTok
      </button>
    </div>
  );
}

export default PublishOptions;
