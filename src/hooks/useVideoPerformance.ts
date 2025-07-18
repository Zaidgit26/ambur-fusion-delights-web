import { useEffect, useState, useRef, useCallback } from 'react';
import { VideoPerformanceMonitor, VideoMetrics, PerformanceMetrics } from '@/utils/videoOptimization';

interface UseVideoPerformanceOptions {
  enableMonitoring?: boolean;
  logToConsole?: boolean;
  reportInterval?: number; // in milliseconds
}

interface VideoPerformanceState {
  isLoading: boolean;
  hasError: boolean;
  loadTime: number | null;
  metrics: Partial<PerformanceMetrics>;
  videoMetrics: VideoMetrics | null;
  optimizationScore: number | null;
  recommendations: string[];
}

export function useVideoPerformance(
  videoRef: React.RefObject<HTMLVideoElement>,
  options: UseVideoPerformanceOptions = {}
) {
  const {
    enableMonitoring = true,
    logToConsole = process.env.NODE_ENV === 'development',
    reportInterval = 5000
  } = options;

  const [state, setState] = useState<VideoPerformanceState>({
    isLoading: false,
    hasError: false,
    loadTime: null,
    metrics: {},
    videoMetrics: null,
    optimizationScore: null,
    recommendations: []
  });

  const monitorRef = useRef<VideoPerformanceMonitor | null>(null);
  const startTimeRef = useRef<number>(0);

  // Initialize performance monitor
  useEffect(() => {
    if (!enableMonitoring) return;

    monitorRef.current = new VideoPerformanceMonitor();
    startTimeRef.current = performance.now();

    return () => {
      monitorRef.current = null;
    };
  }, [enableMonitoring]);

  // Track video loading performance
  const trackVideoLoad = useCallback(async () => {
    if (!videoRef.current || !monitorRef.current || !enableMonitoring) return;

    setState(prev => ({ ...prev, isLoading: true, hasError: false }));

    try {
      const videoMetrics = await monitorRef.current.trackVideoLoad(videoRef.current);
      const loadTime = performance.now() - startTimeRef.current;
      const performanceMetrics = monitorRef.current.getMetrics();

      // Calculate optimization score
      const optimizationScore = calculateOptimizationScore(videoMetrics, performanceMetrics);
      const recommendations = generateRecommendations(videoMetrics, performanceMetrics);

      setState(prev => ({
        ...prev,
        isLoading: false,
        loadTime,
        metrics: performanceMetrics,
        videoMetrics,
        optimizationScore,
        recommendations
      }));

      if (logToConsole) {
        console.group('🎥 Video Performance Report');
        console.log('Load Time:', `${loadTime.toFixed(2)}ms`);
        console.log('Video Metrics:', videoMetrics);
        console.log('Performance Metrics:', performanceMetrics);
        console.log('Optimization Score:', `${optimizationScore}/100`);
        console.log('Recommendations:', recommendations);
        console.groupEnd();
      }

    } catch (error) {
      console.error('Video performance tracking failed:', error);
      setState(prev => ({ ...prev, isLoading: false, hasError: true }));
    }
  }, [videoRef, enableMonitoring, logToConsole]);

  // Monitor video element changes
  useEffect(() => {
    if (!videoRef.current || !enableMonitoring) return;

    const video = videoRef.current;
    
    const handleLoadStart = () => {
      startTimeRef.current = performance.now();
      setState(prev => ({ ...prev, isLoading: true }));
    };

    const handleLoadedData = () => {
      trackVideoLoad();
    };

    const handleError = () => {
      setState(prev => ({ ...prev, isLoading: false, hasError: true }));
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [videoRef, enableMonitoring, trackVideoLoad]);

  // Periodic performance reporting
  useEffect(() => {
    if (!enableMonitoring || !logToConsole || !reportInterval) return;

    const interval = setInterval(() => {
      if (monitorRef.current) {
        const currentMetrics = monitorRef.current.getMetrics();
        console.log('📊 Periodic Performance Update:', currentMetrics);
      }
    }, reportInterval);

    return () => clearInterval(interval);
  }, [enableMonitoring, logToConsole, reportInterval]);

  return {
    ...state,
    startTracking: trackVideoLoad,
    getReport: () => monitorRef.current?.generateReport() || '',
    resetMetrics: () => {
      setState({
        isLoading: false,
        hasError: false,
        loadTime: null,
        metrics: {},
        videoMetrics: null,
        optimizationScore: null,
        recommendations: []
      });
    }
  };
}

function calculateOptimizationScore(
  videoMetrics: VideoMetrics,
  performanceMetrics: Partial<PerformanceMetrics>
): number {
  let score = 100;

  // Video load time (30% weight)
  if (videoMetrics.loadTime > 5000) score -= 30;
  else if (videoMetrics.loadTime > 3000) score -= 20;
  else if (videoMetrics.loadTime > 1000) score -= 10;

  // File size (25% weight)
  const fileSizeMB = videoMetrics.fileSize / (1024 * 1024);
  if (fileSizeMB > 50) score -= 25;
  else if (fileSizeMB > 20) score -= 15;
  else if (fileSizeMB > 10) score -= 5;

  // LCP impact (20% weight)
  if ((performanceMetrics.lcp || 0) > 4000) score -= 20;
  else if ((performanceMetrics.lcp || 0) > 2500) score -= 10;

  // CLS impact (15% weight)
  if ((performanceMetrics.cls || 0) > 0.25) score -= 15;
  else if ((performanceMetrics.cls || 0) > 0.1) score -= 8;

  // Format optimization (10% weight)
  if (videoMetrics.format !== 'WebM' && videoMetrics.format !== 'MP4') score -= 10;
  else if (videoMetrics.format !== 'WebM') score -= 5;

  return Math.max(0, Math.round(score));
}

function generateRecommendations(
  videoMetrics: VideoMetrics,
  performanceMetrics: Partial<PerformanceMetrics>
): string[] {
  const recommendations: string[] = [];

  // File size recommendations
  const fileSizeMB = videoMetrics.fileSize / (1024 * 1024);
  if (fileSizeMB > 20) {
    recommendations.push(`Reduce file size from ${fileSizeMB.toFixed(1)}MB to under 20MB`);
  }

  // Load time recommendations
  if (videoMetrics.loadTime > 3000) {
    recommendations.push(`Improve load time from ${videoMetrics.loadTime.toFixed(0)}ms to under 3000ms`);
  }

  // Format recommendations
  if (videoMetrics.format !== 'WebM') {
    recommendations.push('Consider using WebM format for better compression');
  }

  // Performance recommendations
  if ((performanceMetrics.lcp || 0) > 2500) {
    recommendations.push('Optimize Largest Contentful Paint (LCP) - consider lazy loading');
  }

  if ((performanceMetrics.cls || 0) > 0.1) {
    recommendations.push('Reduce Cumulative Layout Shift (CLS) - add explicit video dimensions');
  }

  // Compression recommendations
  if (videoMetrics.compressionRatio < 100) {
    recommendations.push('Improve video compression - current ratio is too low');
  }

  // Resolution recommendations
  const [width, height] = videoMetrics.resolution.split('x').map(Number);
  if (width > 1920 || height > 1080) {
    recommendations.push('Consider reducing resolution for web delivery');
  }

  return recommendations;
}

// Export types for external use
export type { VideoPerformanceState, UseVideoPerformanceOptions };
