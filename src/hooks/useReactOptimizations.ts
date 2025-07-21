import { useCallback, useMemo, useRef, useEffect } from 'react';
import { useDevicePerformance } from './usePerformanceOptimization';

/**
 * Hook for React-specific performance optimizations
 * Provides memoized callbacks and values for better component performance
 */
export const useReactOptimizations = () => {
  const { shouldReduceAnimations, isLowEnd } = useDevicePerformance();
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());

  // Track component render performance
  useEffect(() => {
    renderCountRef.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;
    lastRenderTimeRef.current = now;

    // Log performance warnings for development
    if (process.env.NODE_ENV === 'development') {
      if (timeSinceLastRender < 16 && renderCountRef.current > 10) {
        console.warn('Component rendering frequently, consider optimization');
      }
    }
  });

  // Memoized style objects for common use cases
  const memoizedStyles = useMemo(() => ({
    gpuAccelerated: {
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden' as const,
      perspective: 1000,
      willChange: 'transform, opacity'
    },
    touchOptimized: {
      touchAction: 'manipulation',
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      userSelect: 'none'
    },
    reducedMotion: shouldReduceAnimations ? {
      animation: 'none !important',
      transition: 'none !important'
    } : {},
    lowEndDevice: isLowEnd ? {
      contain: 'layout style paint',
      isolation: 'isolate'
    } : {}
  }), [shouldReduceAnimations, isLowEnd]);

  // Note: createMemoizedHandler removed due to Rules of Hooks violations
  // Use useCallback directly in components instead

  // Debounced callback factory
  const createDebouncedCallback = useCallback(<T extends any[]>(
    callback: (...args: T) => void,
    delay: number = 300
  ) => {
    const timeoutRef = useRef<NodeJS.Timeout>();
    
    return useCallback((...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, isLowEnd ? delay * 1.5 : delay);
    }, [callback, delay, isLowEnd]);
  }, [isLowEnd]);

  // Throttled callback factory
  const createThrottledCallback = useCallback(<T extends any[]>(
    callback: (...args: T) => void,
    limit: number = 100
  ) => {
    const inThrottle = useRef(false);
    
    return useCallback((...args: T) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, isLowEnd ? limit * 2 : limit);
      }
    }, [callback, limit, isLowEnd]);
  }, [isLowEnd]);

  // Memoized class name builder
  const createClassNameBuilder = useCallback((baseClasses: string) => {
    return useMemo(() => {
      const classes = [baseClasses];
      
      if (shouldReduceAnimations) {
        classes.push('reduce-motion');
      }
      
      if (isLowEnd) {
        classes.push('low-end-device');
      }
      
      return classes.join(' ');
    }, [baseClasses, shouldReduceAnimations, isLowEnd]);
  }, [shouldReduceAnimations, isLowEnd]);

  // Performance monitoring
  const performanceMetrics = useMemo(() => ({
    renderCount: renderCountRef.current,
    shouldOptimize: renderCountRef.current > 20,
    isLowEnd,
    shouldReduceAnimations
  }), [isLowEnd, shouldReduceAnimations]);

  return {
    memoizedStyles,
    createDebouncedCallback,
    createThrottledCallback,
    createClassNameBuilder,
    performanceMetrics,
    shouldReduceAnimations,
    isLowEnd
  };
};

/**
 * Higher-order component for automatic React.memo optimization
 */
export const withPerformanceOptimization = <P extends object>(
  Component: React.ComponentType<P>,
  customCompare?: (prevProps: P, nextProps: P) => boolean
) => {
  const MemoizedComponent = React.memo(Component, customCompare);
  MemoizedComponent.displayName = `withPerformanceOptimization(${Component.displayName || Component.name})`;
  return MemoizedComponent;
};

/**
 * Hook for optimizing list rendering performance
 */
export const useListOptimization = <T>(
  items: T[],
  keyExtractor: (item: T, index: number) => string | number,
  itemsPerPage: number = 20
) => {
  const { isLowEnd } = useDevicePerformance();
  const [currentPage, setCurrentPage] = useState(0);
  
  // Adjust items per page based on device performance
  const optimizedItemsPerPage = useMemo(() => {
    if (isLowEnd) {
      return Math.max(10, itemsPerPage * 0.5);
    }
    return itemsPerPage;
  }, [itemsPerPage, isLowEnd]);

  // Memoized visible items
  const visibleItems = useMemo(() => {
    const startIndex = currentPage * optimizedItemsPerPage;
    const endIndex = startIndex + optimizedItemsPerPage;
    return items.slice(0, endIndex);
  }, [items, currentPage, optimizedItemsPerPage]);

  // Memoized key extractor
  const memoizedKeyExtractor = useCallback(keyExtractor, []);

  // Load more items
  const loadMore = useCallback(() => {
    const maxPage = Math.ceil(items.length / optimizedItemsPerPage) - 1;
    if (currentPage < maxPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, items.length, optimizedItemsPerPage]);

  // Check if more items can be loaded
  const hasMore = useMemo(() => {
    return visibleItems.length < items.length;
  }, [visibleItems.length, items.length]);

  return {
    visibleItems,
    keyExtractor: memoizedKeyExtractor,
    loadMore,
    hasMore,
    currentPage,
    totalPages: Math.ceil(items.length / optimizedItemsPerPage)
  };
};

/**
 * Hook for optimizing form performance
 */
export const useFormOptimization = () => {
  const { createDebouncedCallback, createThrottledCallback } = useReactOptimizations();

  // Debounced form validation
  const createDebouncedValidator = useCallback((
    validator: (value: any) => boolean | string,
    delay: number = 300
  ) => {
    return createDebouncedCallback(validator, delay);
  }, [createDebouncedCallback]);

  // Throttled form submission
  const createThrottledSubmit = useCallback((
    submitHandler: (data: any) => void,
    limit: number = 1000
  ) => {
    return createThrottledCallback(submitHandler, limit);
  }, [createThrottledCallback]);

  return {
    createDebouncedValidator,
    createThrottledSubmit
  };
};

// Re-export React for convenience
import React, { useState } from 'react';
export { React };
