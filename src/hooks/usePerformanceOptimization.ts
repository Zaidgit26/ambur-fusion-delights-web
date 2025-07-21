import { useEffect, useCallback, useRef, useMemo, useState } from 'react';

/**
 * Hook for detecting device performance capabilities
 */
export const useDevicePerformance = () => {
  const performanceInfo = useMemo(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Estimate device performance based on various factors
    const getDevicePerformance = () => {
      let score = 0;
      
      // Check hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 2;
      score += Math.min(cores * 10, 40);
      
      // Check memory (if available)
      const memory = (navigator as any).deviceMemory;
      if (memory) {
        score += Math.min(memory * 10, 30);
      } else {
        score += 15; // Default assumption
      }
      
      // Check connection speed
      const connection = (navigator as any).connection;
      if (connection) {
        const effectiveType = connection.effectiveType;
        switch (effectiveType) {
          case '4g':
            score += 20;
            break;
          case '3g':
            score += 10;
            break;
          case '2g':
            score += 5;
            break;
          default:
            score += 15;
        }
      } else {
        score += 15; // Default assumption
      }
      
      // Check user agent for known low-performance indicators
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('android') && userAgent.includes('chrome/')) {
        const chromeVersion = parseInt(userAgent.match(/chrome\/(\d+)/)?.[1] || '0');
        if (chromeVersion < 80) score -= 10;
      }
      
      return Math.max(0, Math.min(100, score));
    };
    
    const performanceScore = getDevicePerformance();
    
    return {
      score: performanceScore,
      isLowEnd: performanceScore < 40,
      isMidRange: performanceScore >= 40 && performanceScore < 70,
      isHighEnd: performanceScore >= 70,
      prefersReducedMotion,
      shouldReduceAnimations: prefersReducedMotion || performanceScore < 50
    };
  }, []);

  return performanceInfo;
};

/**
 * Hook for optimized scroll handling with performance considerations
 */
export const useOptimizedScroll = (
  callback: (scrollY: number) => void,
  options: { throttle?: number; passive?: boolean } = {}
) => {
  const { throttle = 16, passive = true } = options;
  const { isLowEnd } = useDevicePerformance();
  const lastCallTime = useRef(0);
  const rafId = useRef<number>();

  const optimizedCallback = useCallback((scrollY: number) => {
    const now = Date.now();
    const adjustedThrottle = isLowEnd ? throttle * 2 : throttle;
    
    if (now - lastCallTime.current >= adjustedThrottle) {
      callback(scrollY);
      lastCallTime.current = now;
    }
  }, [callback, throttle, isLowEnd]);

  const handleScroll = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    
    rafId.current = requestAnimationFrame(() => {
      optimizedCallback(window.scrollY);
    });
  }, [optimizedCallback]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleScroll, passive]);
};

/**
 * Hook for intersection observer with performance optimizations
 */
export const useOptimizedIntersection = (
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
) => {
  const { isLowEnd } = useDevicePerformance();
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Adjust thresholds based on device performance
    const optimizedOptions = {
      ...options,
      rootMargin: options.rootMargin || (isLowEnd ? '50px' : '20px'),
      threshold: options.threshold || (isLowEnd ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1])
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          callback(entry.isIntersecting);
        });
      },
      optimizedOptions
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options, isLowEnd]);

  return elementRef;
};

/**
 * Hook for debounced resize handling
 */
export const useOptimizedResize = (
  callback: (width: number, height: number) => void,
  delay: number = 150
) => {
  const { isLowEnd } = useDevicePerformance();
  const timeoutRef = useRef<number>();

  const debouncedCallback = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const adjustedDelay = isLowEnd ? delay * 1.5 : delay;
    
    timeoutRef.current = setTimeout(() => {
      callback(window.innerWidth, window.innerHeight);
    }, adjustedDelay);
  }, [callback, delay, isLowEnd]);

  useEffect(() => {
    window.addEventListener('resize', debouncedCallback);
    
    return () => {
      window.removeEventListener('resize', debouncedCallback);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [debouncedCallback]);
};

/**
 * Hook for optimized image loading
 */
export const useOptimizedImage = (src: string, options: { 
  lazy?: boolean; 
  quality?: 'low' | 'medium' | 'high';
  placeholder?: string;
} = {}) => {
  const { lazy = true, quality = 'medium', placeholder } = options;
  const { isLowEnd, shouldReduceAnimations } = useDevicePerformance();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Adjust quality based on device performance
  const optimizedSrc = useMemo(() => {
    if (isLowEnd && quality === 'high') {
      return src.replace(/\.(jpg|jpeg|png|webp)$/i, '_medium.$1');
    }
    return src;
  }, [src, quality, isLowEnd]);

  useEffect(() => {
    if (!lazy) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setError(true);
      img.src = optimizedSrc;
    }
  }, [optimizedSrc, lazy]);

  const intersectionRef = useOptimizedIntersection(
    (isIntersecting) => {
      if (isIntersecting && lazy && !isLoaded && !error) {
        const img = new Image();
        img.onload = () => setIsLoaded(true);
        img.onerror = () => setError(true);
        img.src = optimizedSrc;
      }
    },
    { rootMargin: '50px' }
  );

  return {
    src: isLoaded ? optimizedSrc : placeholder,
    isLoaded,
    error,
    ref: lazy ? intersectionRef : imgRef,
    shouldReduceAnimations
  };
};

/**
 * Hook for memory usage monitoring
 */
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<{
    used: number;
    total: number;
    percentage: number;
  } | null>(null);

  useEffect(() => {
    const checkMemory = () => {
      const memory = (performance as any).memory;
      if (memory) {
        const used = memory.usedJSHeapSize;
        const total = memory.totalJSHeapSize;
        const percentage = (used / total) * 100;
        
        setMemoryInfo({ used, total, percentage });
        
        // Log warning if memory usage is high
        if (percentage > 80) {
          console.warn('High memory usage detected:', percentage.toFixed(2) + '%');
        }
      }
    };

    checkMemory();
    const interval = setInterval(checkMemory, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};
