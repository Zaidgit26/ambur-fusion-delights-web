import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimizedVideoBackgroundProps {
  videoSources: {
    webm?: string;
    mp4: string;
    mobile?: string;
  };
  posterImage: string;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  children?: React.ReactNode;
  lazy?: boolean;
  mobileStrategy?: 'video' | 'image' | 'auto';
  quality?: 'high' | 'medium' | 'low';
  maxFileSize?: number; // in MB
}

interface ConnectionInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
}

const OptimizedVideoBackground: React.FC<OptimizedVideoBackgroundProps> = memo(({
  videoSources,
  posterImage,
  className = '',
  overlay = true,
  overlayOpacity = 0.6,
  children,
  lazy = true,
  mobileStrategy = 'auto',
  quality = 'high',
  maxFileSize = 20
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'medium' | 'fast'>('fast');
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Device and connection detection
  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                           window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };

    // Check connection speed
    const checkConnection = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        const { effectiveType, downlink, rtt }: ConnectionInfo = connection;
        
        if (['slow-2g', '2g'].includes(effectiveType) || downlink < 0.5) {
          setConnectionSpeed('slow');
        } else if (['3g'].includes(effectiveType) || downlink < 1.5) {
          setConnectionSpeed('medium');
        } else {
          setConnectionSpeed('fast');
        }
      }
    };

    // Check reduced motion preference
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    };

    checkMobile();
    checkConnection();
    const cleanupReducedMotion = checkReducedMotion();

    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      cleanupReducedMotion();
    };
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [lazy]);

  // Determine if video should load based on strategy
  useEffect(() => {
    if (prefersReducedMotion) {
      setShouldLoadVideo(false);
      return;
    }

    if (!isInView) {
      setShouldLoadVideo(false);
      return;
    }

    // Mobile strategy logic
    if (isMobile) {
      switch (mobileStrategy) {
        case 'image':
          setShouldLoadVideo(false);
          return;
        case 'video':
          setShouldLoadVideo(true);
          break;
        case 'auto':
          // Auto: load video only on fast connections for mobile
          setShouldLoadVideo(connectionSpeed === 'fast');
          break;
      }
    } else {
      // Desktop: load video unless connection is very slow
      setShouldLoadVideo(connectionSpeed !== 'slow');
    }
  }, [isMobile, mobileStrategy, connectionSpeed, prefersReducedMotion, isInView]);

  // Video loading and error handling
  const handleVideoLoad = useCallback(() => {
    setIsLoaded(true);
    setLoadingProgress(100);
  }, []);

  const handleVideoError = useCallback((error: any) => {
    console.error('Video loading error:', error);
    setHasError(true);
    setIsLoaded(false);
  }, []);

  const handleLoadProgress = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const duration = video.duration;
      if (duration > 0) {
        setLoadingProgress((bufferedEnd / duration) * 100);
      }
    }
  }, []);

  // Video source selection based on device and connection
  const getOptimalVideoSource = useCallback(() => {
    if (isMobile && videoSources.mobile) {
      return videoSources.mobile;
    }
    
    // Prefer WebM for better compression on supported browsers
    if (videoSources.webm && connectionSpeed === 'fast') {
      const video = document.createElement('video');
      if (video.canPlayType('video/webm') !== '') {
        return videoSources.webm;
      }
    }
    
    return videoSources.mp4;
  }, [isMobile, videoSources, connectionSpeed]);

  // Show static image fallback
  if (!shouldLoadVideo || hasError) {
    return (
      <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${posterImage})` }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
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
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Loading skeleton */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/20 rounded-full h-1 overflow-hidden">
                <motion.div
                  className="h-full bg-white/60"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-white/80 text-sm mt-2">Loading video... {Math.round(loadingProgress)}%</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Poster image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${posterImage})` }}
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Optimized video */}
      <motion.video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterImage}
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        onProgress={handleLoadProgress}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        style={{
          filter: quality === 'high' ? 'brightness(0.85) contrast(1.1)' : 'brightness(0.9) contrast(1.05)',
        }}
        aria-label="Background video showcasing restaurant ambiance"
        role="img"
      >
        <source src={getOptimalVideoSource()} type={videoSources.webm ? "video/webm" : "video/mp4"} />
        <source src={videoSources.mp4} type="video/mp4" />
        Your browser does not support the video tag.
      </motion.video>

      {/* Enhanced overlay */}
      {overlay && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/50 to-black/40"
          style={{ opacity: overlayOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? overlayOpacity : overlayOpacity * 0.7 }}
          transition={{ duration: 0.8 }}
        />
      )}

      {children}
    </div>
  );
});

OptimizedVideoBackground.displayName = 'OptimizedVideoBackground';

export default OptimizedVideoBackground;
