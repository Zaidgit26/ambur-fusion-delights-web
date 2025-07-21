import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useDevicePerformance } from './usePerformanceOptimization';
import { useResponsiveBreakpoints } from './useResponsiveBreakpoints';

/**
 * Hook for mobile-specific performance optimizations
 * Targets 60fps performance on mobile devices (320px-768px)
 */
export const useMobileOptimization = () => {
  const { shouldReduceAnimations, isLowEnd } = useDevicePerformance();
  const responsive = useResponsiveBreakpoints();
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Mobile-specific animation configuration
  const mobileAnimationConfig = useMemo(() => {
    if (!responsive.isMobile) {
      return {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        stagger: 0.1
      };
    }

    if (shouldReduceAnimations) {
      return {
        duration: 0.05,
        ease: 'linear' as const,
        stagger: 0
      };
    }

    if (isLowEnd) {
      return {
        duration: 0.15,
        ease: 'easeOut' as const,
        stagger: 0.05
      };
    }

    return {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as const,
      stagger: 0.08
    };
  }, [responsive.isMobile, shouldReduceAnimations, isLowEnd]);

  // Touch event optimization
  const optimizeTouchEvents = useCallback((element: HTMLElement) => {
    if (!responsive.touchDevice) return;

    // Passive touch listeners for better performance
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
      
      // Prevent scroll if horizontal swipe is detected
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      touchStartRef.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [responsive.touchDevice]);

  // Memory optimization for mobile
  const optimizeMemoryUsage = useCallback(() => {
    if (!responsive.isMobile) return;

    // Cleanup unused images
    const images = document.querySelectorAll('img[data-loaded="false"]');
    images.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight + 200 && rect.bottom > -200;
      
      if (!isVisible) {
        (img as HTMLImageElement).src = '';
      }
    });

    // Force garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }, [responsive.isMobile]);

  // Viewport optimization
  const optimizeViewport = useCallback(() => {
    if (!responsive.isMobile) return;

    // Set viewport meta tag for optimal mobile rendering
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }

    const viewportContent = [
      'width=device-width',
      'initial-scale=1.0',
      'maximum-scale=5.0',
      'user-scalable=yes',
      'viewport-fit=cover'
    ].join(', ');

    viewport.setAttribute('content', viewportContent);

    // Optimize for mobile browsers
    document.documentElement.style.setProperty('-webkit-text-size-adjust', '100%');
    document.documentElement.style.setProperty('-webkit-tap-highlight-color', 'transparent');
  }, [responsive.isMobile]);

  // Reduced motion support
  const getReducedMotionStyles = useCallback(() => {
    if (!responsive.prefersReducedMotion) return {};

    return {
      animation: 'none !important',
      transition: 'none !important',
      transform: 'none !important'
    };
  }, [responsive.prefersReducedMotion]);

  // Mobile-specific CSS classes
  const getMobileClasses = useCallback(() => {
    const classes = [];

    if (responsive.isMobile) {
      classes.push('mobile-optimized');
    }

    if (responsive.touchDevice) {
      classes.push('touch-device');
    }

    if (shouldReduceAnimations) {
      classes.push('reduce-motion');
    }

    if (isLowEnd) {
      classes.push('low-end-device');
    }

    return classes.join(' ');
  }, [responsive.isMobile, responsive.touchDevice, shouldReduceAnimations, isLowEnd]);

  // Initialize mobile optimizations
  useEffect(() => {
    if (responsive.isMobile) {
      optimizeViewport();
      
      // Periodic memory cleanup
      const memoryCleanupInterval = setInterval(optimizeMemoryUsage, 30000); // Every 30 seconds
      
      return () => {
        clearInterval(memoryCleanupInterval);
      };
    }
  }, [responsive.isMobile, optimizeViewport, optimizeMemoryUsage]);

  return {
    mobileAnimationConfig,
    optimizeTouchEvents,
    optimizeMemoryUsage,
    optimizeViewport,
    getReducedMotionStyles,
    getMobileClasses,
    isMobile: responsive.isMobile,
    isLowEnd,
    shouldReduceAnimations
  };
};

/**
 * Hook for mobile-specific touch target optimization
 */
export const useMobileTouchTargets = () => {
  const responsive = useResponsiveBreakpoints();

  const getTouchTargetStyles = useCallback((size: 'small' | 'medium' | 'large' = 'medium') => {
    if (!responsive.touchDevice) return {};

    const sizes = {
      small: { minHeight: '44px', minWidth: '44px', padding: '8px' },
      medium: { minHeight: '48px', minWidth: '48px', padding: '12px' },
      large: { minHeight: '56px', minWidth: '56px', padding: '16px' }
    };

    return {
      ...sizes[size],
      cursor: 'pointer',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      WebkitTouchCallout: 'none',
      WebkitTapHighlightColor: 'transparent'
    };
  }, [responsive.touchDevice]);

  const getTouchTargetClasses = useCallback((size: 'small' | 'medium' | 'large' = 'medium') => {
    if (!responsive.touchDevice) return '';

    const sizeClasses = {
      small: 'min-h-[44px] min-w-[44px] p-2',
      medium: 'min-h-[48px] min-w-[48px] p-3',
      large: 'min-h-[56px] min-w-[56px] p-4'
    };

    return `${sizeClasses[size]} cursor-pointer select-none touch-manipulation`;
  }, [responsive.touchDevice]);

  return {
    getTouchTargetStyles,
    getTouchTargetClasses,
    isTouchDevice: responsive.touchDevice
  };
};

/**
 * Hook for mobile-specific scroll optimization
 */
export const useMobileScrollOptimization = () => {
  const responsive = useResponsiveBreakpoints();
  const { isLowEnd } = useDevicePerformance();

  const optimizeScrolling = useCallback((element: HTMLElement) => {
    if (!responsive.isMobile) return;

    // Enable hardware acceleration for scrolling
    element.style.setProperty('-webkit-overflow-scrolling', 'touch');
    element.style.setProperty('overscroll-behavior', 'contain');
    element.style.setProperty('scroll-behavior', isLowEnd ? 'auto' : 'smooth');

    // Optimize scroll performance
    element.style.setProperty('will-change', 'scroll-position');
    element.style.setProperty('transform', 'translateZ(0)');
  }, [responsive.isMobile, isLowEnd]);

  return {
    optimizeScrolling,
    isMobile: responsive.isMobile
  };
};
