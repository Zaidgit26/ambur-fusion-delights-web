import React, { useRef, useEffect, useState } from 'react';

interface SimpleVideoBackgroundProps {
  videoSrc: string;
  fallbackImage: string;
  className?: string;
  children?: React.ReactNode;
}

const SimpleVideoBackground: React.FC<SimpleVideoBackgroundProps> = ({
  videoSrc,
  fallbackImage,
  className = '',
  children
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      console.log('Video loaded successfully');
      setVideoLoaded(true);
      video.play().catch((error) => {
        console.error('Video play failed:', error);
        setVideoError(true);
      });
    };

    const handleError = (e: any) => {
      console.error('Video loading error:', e);
      setVideoError(true);
    };

    const handleCanPlay = () => {
      console.log('Video can play');
      setVideoLoaded(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    // Force load the video
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Fallback Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${fallbackImage})`,
          opacity: videoLoaded && !videoError ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }}
      />

      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          opacity: videoLoaded && !videoError ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/50 to-black/40" />

      {/* Content */}
      {children}
    </div>
  );
};

export default SimpleVideoBackground;
