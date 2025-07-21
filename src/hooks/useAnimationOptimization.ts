import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useDevicePerformance } from './usePerformanceOptimization';
import { useResponsiveBreakpoints } from './useResponsiveBreakpoints';

/**
 * Hook for creating performance-optimized Framer Motion variants
 */
export const useOptimizedAnimations = () => {
  const { shouldReduceAnimations, isLowEnd } = useDevicePerformance();
  const responsive = useResponsiveBreakpoints();

  // Base animation configurations based on device performance
  const animationConfig = useMemo(() => {
    if (shouldReduceAnimations) {
      return {
        duration: 0.1,
        ease: 'linear' as const,
        staggerChildren: 0,
        delayChildren: 0
      };
    }

    if (isLowEnd) {
      return {
        duration: 0.3,
        ease: 'easeOut' as const,
        staggerChildren: 0.05,
        delayChildren: 0.1
      };
    }

    if (responsive.isMobile) {
      return {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as const,
        staggerChildren: 0.08,
        delayChildren: 0.1
      };
    }

    return {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
      staggerChildren: 0.1,
      delayChildren: 0.2
    };
  }, [shouldReduceAnimations, isLowEnd, responsive.isMobile]);

  // Navigation animation variants
  const navigationVariants = useMemo(() => ({
    hidden: {
      y: shouldReduceAnimations ? 0 : -100,
      opacity: 0,
      ...(shouldReduceAnimations ? {} : { backdropFilter: 'blur(0px)' })
    },
    visible: {
      y: 0,
      opacity: 1,
      ...(shouldReduceAnimations ? {} : { backdropFilter: 'blur(8px)' }),
      transition: {
        duration: animationConfig.duration,
        ease: animationConfig.ease
      }
    },
    exit: {
      y: shouldReduceAnimations ? 0 : -100,
      opacity: 0,
      transition: {
        duration: animationConfig.duration * 0.7,
        ease: animationConfig.ease
      }
    }
  }), [shouldReduceAnimations, animationConfig]);

  // Mobile menu animation variants
  const mobileMenuVariants = useMemo(() => ({
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: animationConfig.duration,
        ease: animationConfig.ease,
        when: 'afterChildren'
      }
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: animationConfig.duration,
        ease: animationConfig.ease,
        when: 'beforeChildren',
        staggerChildren: animationConfig.staggerChildren,
        delayChildren: animationConfig.delayChildren
      }
    }
  }), [animationConfig]);

  // Menu item animation variants
  const menuItemVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: shouldReduceAnimations ? 0 : 20,
      scale: shouldReduceAnimations ? 1 : 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: animationConfig.duration,
        ease: animationConfig.ease
      }
    },
    hover: shouldReduceAnimations ? {} : {
      scale: 1.02,
      y: -2,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    tap: shouldReduceAnimations ? {} : {
      scale: 0.98,
      transition: {
        duration: 0.1,
        ease: 'easeOut'
      }
    }
  }), [shouldReduceAnimations, animationConfig]);



  // Button animation variants
  const buttonVariants = useMemo(() => ({
    idle: { scale: 1 },
    hover: shouldReduceAnimations ? { scale: 1 } : {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    tap: shouldReduceAnimations ? { scale: 1 } : {
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: 'easeOut'
      }
    }
  }), [shouldReduceAnimations]);

  // Stagger container variants
  const staggerContainerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: animationConfig.staggerChildren,
        delayChildren: animationConfig.delayChildren
      }
    }
  }), [animationConfig]);

  return {
    navigationVariants,
    mobileMenuVariants,
    menuItemVariants,
    buttonVariants,
    staggerContainerVariants,
    animationConfig,
    shouldReduceAnimations
  };
};

/**
 * Hook for optimized scroll-triggered animations
 */
export const useScrollAnimations = () => {
  const { shouldReduceAnimations, isLowEnd } = useDevicePerformance();
  const observerRef = useRef<IntersectionObserver>();
  const elementsRef = useRef<Map<Element, () => void>>(new Map());
  const isSupported = useRef(typeof IntersectionObserver !== 'undefined');

  const observeElement = useCallback((
    element: Element,
    callback: () => void,
    options: IntersectionObserverInit = {}
  ) => {
    if (shouldReduceAnimations || !isSupported.current) {
      // Skip animations if reduced motion is preferred
      callback();
      return;
    }

    if (!observerRef.current) {
      const defaultOptions = {
        rootMargin: isLowEnd ? '100px' : '50px',
        threshold: isLowEnd ? [0, 0.5] : [0, 0.25, 0.5, 0.75, 1]
      };

      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cb = elementsRef.current.get(entry.target);
            if (cb) {
              cb();
              observerRef.current?.unobserve(entry.target);
              elementsRef.current.delete(entry.target);
            }
          }
        });
      }, { ...defaultOptions, ...options });
    }

    elementsRef.current.set(element, callback);
    observerRef.current.observe(element);
  }, [shouldReduceAnimations, isLowEnd]);

  const unobserveElement = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
      elementsRef.current.delete(element);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      elementsRef.current.clear();
    };
  }, []);

  return { observeElement, unobserveElement };
};

/**
 * Hook for frame rate monitoring and animation adjustment
export const useFrameRateMonitor = () => {
  const [frameRate, setFrameRate] = useState<number>(60);
  const frameRateRef = useRef<number>(60);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);
  const isMonitoringRef = useRef<boolean>(true);

  const measureFrameRate = useCallback(() => {
    if (!isMonitoringRef.current) return;

    const now = performance.now();
    const delta = now - lastFrameTimeRef.current;
    
    if (delta >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / delta);
      frameRateRef.current = fps;
      setFrameRate(fps);
      frameCountRef.current = 0;
      lastFrameTimeRef.current = now;
    } else {
      frameCountRef.current++;
    }

    requestAnimationFrame(measureFrameRate);
  }, []);

  useEffect(() => {
    const rafId = requestAnimationFrame(measureFrameRate);
    return () => cancelAnimationFrame(rafId);
  }, [measureFrameRate]);

  const getPerformanceLevel = useCallback(() => {
    const fps = frameRateRef.current;
    if (fps >= 55) return 'high';
    if (fps >= 30) return 'medium';
    return 'low';
  }, []);

  const startMonitoring = useCallback(() => {
    isMonitoringRef.current = true;
    requestAnimationFrame(measureFrameRate);
  }, [measureFrameRate]);

  const stopMonitoring = useCallback(() => {
    isMonitoringRef.current = false;
  }, []);

  return {
    frameRate,
    getPerformanceLevel,
    startMonitoring,
    stopMonitoring
  };
};
};

/**
 * Hook for GPU-accelerated animations
 */
export const useGPUAcceleration = () => {
  const { shouldReduceAnimations } = useDevicePerformance();

  const getGPUStyles = useCallback((enable: boolean = true) => {
    if (shouldReduceAnimations || !enable) {
      return {};
    }

    return {
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden' as const,
      perspective: 1000,
      willChange: 'transform, opacity'
    };
  }, [shouldReduceAnimations]);

  const enableGPUAcceleration = useCallback((element: HTMLElement) => {
    if (shouldReduceAnimations) return;

    Object.assign(element.style, getGPUStyles());
  }, [shouldReduceAnimations, getGPUStyles]);

  const disableGPUAcceleration = useCallback((element: HTMLElement) => {
    element.style.transform = '';
    element.style.backfaceVisibility = '';
    element.style.perspective = '';
    element.style.willChange = '';
  }, []);

  return {
    getGPUStyles,
    enableGPUAcceleration,
    disableGPUAcceleration
  };
};
