import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import VideoControls from './video-controls';

interface VideoBackgroundProps {
  videoSources: {
    webm?: string;
    mp4: string;
    mobile?: string;
  };
  fallbackImage: string;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  children?: React.ReactNode;
  lazy?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  quality?: 'high' | 'medium' | 'low';
  showControls?: boolean;
  autoPlay?: boolean;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoSources,
  fallbackImage,
  className = '',
  overlay = true,
  overlayOpacity = 0.4,
  children,
  lazy = false,
  preload = 'metadata',
  quality = 'high',
  showControls = false,
  autoPlay = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'fast'>('fast');
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Check connection speed
    const connection = (navigator as any).connection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      setConnectionSpeed(['slow-2g', '2g', '3g'].includes(effectiveType) ? 'slow' : 'fast');
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = videoRef.current?.parentElement;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => observer.disconnect();
  }, [lazy]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isPlaying) {
        handlePlayPause();
      }
      if (event.key === ' ' && event.target === document.body) {
        event.preventDefault();
        handlePlayPause();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  // Control handlers
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion || !isInView) return;

    // Don't load video on slow connections unless explicitly requested
    if (connectionSpeed === 'slow' && quality === 'high') {
      setHasError(true);
      return;
    }

    const handleLoadedData = () => {
      setIsLoaded(true);
      // Ensure video plays smoothly
      video.play().catch(console.error);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(false);
    };

    const handleCanPlayThrough = () => {
      setIsLoaded(true);
    };

    const handleLoadStart = () => {
      // Show loading state
      setIsLoaded(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('loadstart', handleLoadStart);

    // Load video only when in view
    if (isInView) {
      video.load();
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [prefersReducedMotion, isInView, connectionSpeed, quality]);

  // Show fallback image if reduced motion is preferred or video failed
  if (prefersReducedMotion || hasError) {
    return (
      <div className={`relative ${className}`}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        />
        {overlay && (
          <div
            className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/50 to-black/40"
            style={{ opacity: overlayOpacity }}
          />
        )}
        {children}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Fallback image shown while video loads */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fallbackImage})` }}
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Video Background */}
      <motion.video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay={autoPlay && !prefersReducedMotion}
        muted={isMuted}
        loop
        playsInline
        preload={preload}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          filter: quality === 'high' ? 'brightness(0.8) contrast(1.1)' : 'brightness(0.85) contrast(1.05)',
        }}
        aria-label="Background video"
        role="img"
        tabIndex={showControls ? 0 : -1}
      >
        {/* WebM for modern browsers (better compression) */}
        {videoSources.webm && (
          <source src={videoSources.webm} type="video/webm" />
        )}

        {/* MP4 - primary source */}
        <source src={videoSources.mp4} type="video/mp4" />

        {/* Mobile version if available */}
        {videoSources.mobile && (
          <source
            src={videoSources.mobile}
            type="video/mp4"
            media="(max-width: 768px)"
          />
        )}

        Your browser does not support the video tag.
      </motion.video>

      {/* Video Overlay */}
      {overlay && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/50 to-black/40"
          style={{ opacity: overlayOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? overlayOpacity : 0 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Video Controls */}
      {showControls && !prefersReducedMotion && isLoaded && (
        <VideoControls
          videoRef={videoRef}
          isPlaying={isPlaying}
          isMuted={isMuted}
          onPlayPause={handlePlayPause}
          onMuteToggle={handleMuteToggle}
        />
      )}

      {children}
    </div>
  );
};

export default VideoBackground;
