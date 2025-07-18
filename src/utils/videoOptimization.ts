/**
 * Video Optimization Utilities
 * Provides tools for video performance monitoring and optimization
 */

export interface VideoMetrics {
  loadTime: number;
  fileSize: number;
  resolution: string;
  bitrate: number;
  format: string;
  compressionRatio: number;
}

export interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  videoLoadTime: number;
  totalPageLoadTime: number;
}

export class VideoPerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private videoElement: HTMLVideoElement | null = null;
  private startTime: number = 0;

  constructor(videoElement?: HTMLVideoElement) {
    this.videoElement = videoElement;
    this.startTime = performance.now();
    this.initializeMetrics();
  }

  private initializeMetrics() {
    // Monitor Core Web Vitals
    this.observeLCP();
    this.observeCLS();
    this.observeFID();
  }

  private observeLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  private observeCLS() {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.metrics.cls = clsValue;
    });
    observer.observe({ entryTypes: ['layout-shift'] });
  }

  private observeFID() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0];
      this.metrics.fid = firstEntry.processingStart - firstEntry.startTime;
    });
    observer.observe({ entryTypes: ['first-input'] });
  }

  public trackVideoLoad(videoElement: HTMLVideoElement): Promise<VideoMetrics> {
    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      
      const handleLoadedData = () => {
        const loadTime = performance.now() - startTime;
        this.metrics.videoLoadTime = loadTime;

        // Get video metrics
        const metrics: VideoMetrics = {
          loadTime,
          fileSize: this.estimateFileSize(videoElement),
          resolution: `${videoElement.videoWidth}x${videoElement.videoHeight}`,
          bitrate: this.estimateBitrate(videoElement),
          format: this.getVideoFormat(videoElement),
          compressionRatio: this.calculateCompressionRatio(videoElement)
        };

        videoElement.removeEventListener('loadeddata', handleLoadedData);
        videoElement.removeEventListener('error', handleError);
        resolve(metrics);
      };

      const handleError = (error: Event) => {
        videoElement.removeEventListener('loadeddata', handleLoadedData);
        videoElement.removeEventListener('error', handleError);
        reject(error);
      };

      videoElement.addEventListener('loadeddata', handleLoadedData);
      videoElement.addEventListener('error', handleError);
    });
  }

  private estimateFileSize(video: HTMLVideoElement): number {
    // Estimate based on duration, resolution, and bitrate
    const duration = video.duration || 30; // fallback to 30 seconds
    const width = video.videoWidth || 1920;
    const height = video.videoHeight || 1080;
    const estimatedBitrate = this.estimateBitrate(video);
    
    return (duration * estimatedBitrate * 1000) / 8; // Convert to bytes
  }

  private estimateBitrate(video: HTMLVideoElement): number {
    // Estimate bitrate based on resolution
    const pixels = (video.videoWidth || 1920) * (video.videoHeight || 1080);
    
    if (pixels <= 640 * 480) return 1000; // 1 Mbps for SD
    if (pixels <= 1280 * 720) return 2500; // 2.5 Mbps for HD
    if (pixels <= 1920 * 1080) return 5000; // 5 Mbps for Full HD
    return 8000; // 8 Mbps for 4K
  }

  private getVideoFormat(video: HTMLVideoElement): string {
    const source = video.currentSrc || video.src;
    if (source.includes('.webm')) return 'WebM';
    if (source.includes('.mp4')) return 'MP4';
    if (source.includes('.mov')) return 'MOV';
    return 'Unknown';
  }

  private calculateCompressionRatio(video: HTMLVideoElement): number {
    const uncompressedSize = (video.videoWidth || 1920) * (video.videoHeight || 1080) * 3 * (video.duration || 30) * 30; // RGB * duration * fps
    const compressedSize = this.estimateFileSize(video);
    return uncompressedSize / compressedSize;
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public generateReport(): string {
    const metrics = this.getMetrics();
    return `
Video Performance Report:
========================
LCP: ${metrics.lcp?.toFixed(2)}ms
CLS: ${metrics.cls?.toFixed(4)}
FID: ${metrics.fid?.toFixed(2)}ms
Video Load Time: ${metrics.videoLoadTime?.toFixed(2)}ms

Recommendations:
${this.generateRecommendations(metrics)}
    `.trim();
  }

  private generateRecommendations(metrics: Partial<PerformanceMetrics>): string {
    const recommendations: string[] = [];

    if ((metrics.lcp || 0) > 2500) {
      recommendations.push('- Consider reducing video file size or implementing lazy loading');
    }

    if ((metrics.cls || 0) > 0.1) {
      recommendations.push('- Add explicit dimensions to video element to prevent layout shifts');
    }

    if ((metrics.fid || 0) > 100) {
      recommendations.push('- Optimize video loading to reduce main thread blocking');
    }

    if ((metrics.videoLoadTime || 0) > 3000) {
      recommendations.push('- Compress video further or provide multiple quality options');
    }

    return recommendations.length > 0 ? recommendations.join('\n') : '- Performance looks good!';
  }
}

/**
 * Video Optimization Recommendations
 */
export const VIDEO_OPTIMIZATION_GUIDELINES = {
  fileSize: {
    mobile: 10, // MB
    desktop: 20, // MB
    maximum: 50 // MB
  },
  duration: {
    recommended: 15, // seconds
    maximum: 30 // seconds
  },
  resolution: {
    mobile: '720p',
    desktop: '1080p',
    maximum: '1440p'
  },
  bitrate: {
    low: 1, // Mbps
    medium: 2.5, // Mbps
    high: 5 // Mbps
  },
  formats: ['WebM', 'MP4'],
  compression: {
    codec: 'H.264',
    profile: 'High',
    level: '4.0'
  }
};

/**
 * Utility function to check if video meets optimization guidelines
 */
export function validateVideoOptimization(metrics: VideoMetrics): {
  isOptimized: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = [];
  let score = 100;

  // Check file size
  if (metrics.fileSize > VIDEO_OPTIMIZATION_GUIDELINES.fileSize.maximum * 1024 * 1024) {
    issues.push(`File size too large: ${(metrics.fileSize / 1024 / 1024).toFixed(1)}MB`);
    score -= 30;
  }

  // Check load time
  if (metrics.loadTime > 3000) {
    issues.push(`Load time too slow: ${metrics.loadTime.toFixed(0)}ms`);
    score -= 20;
  }

  // Check format
  if (!VIDEO_OPTIMIZATION_GUIDELINES.formats.includes(metrics.format)) {
    issues.push(`Suboptimal format: ${metrics.format}`);
    score -= 15;
  }

  // Check compression ratio
  if (metrics.compressionRatio < 100) {
    issues.push(`Poor compression ratio: ${metrics.compressionRatio.toFixed(1)}:1`);
    score -= 10;
  }

  return {
    isOptimized: issues.length === 0,
    issues,
    score: Math.max(0, score)
  };
}

/**
 * Generate optimized video configuration based on device and connection
 */
export function getOptimalVideoConfig(
  isMobile: boolean,
  connectionSpeed: 'slow' | 'medium' | 'fast'
): {
  shouldLoadVideo: boolean;
  quality: 'low' | 'medium' | 'high';
  preload: 'none' | 'metadata' | 'auto';
  maxFileSize: number;
} {
  if (isMobile) {
    switch (connectionSpeed) {
      case 'slow':
        return {
          shouldLoadVideo: false,
          quality: 'low',
          preload: 'none',
          maxFileSize: 5
        };
      case 'medium':
        return {
          shouldLoadVideo: true,
          quality: 'medium',
          preload: 'metadata',
          maxFileSize: 10
        };
      case 'fast':
        return {
          shouldLoadVideo: true,
          quality: 'high',
          preload: 'metadata',
          maxFileSize: 15
        };
    }
  } else {
    switch (connectionSpeed) {
      case 'slow':
        return {
          shouldLoadVideo: true,
          quality: 'low',
          preload: 'metadata',
          maxFileSize: 10
        };
      case 'medium':
        return {
          shouldLoadVideo: true,
          quality: 'medium',
          preload: 'metadata',
          maxFileSize: 20
        };
      case 'fast':
        return {
          shouldLoadVideo: true,
          quality: 'high',
          preload: 'auto',
          maxFileSize: 30
        };
    }
  }
}
