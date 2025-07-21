import { useState, useEffect, useCallback } from 'react';

// Breakpoint definitions matching our CSS system
export const BREAKPOINTS = {
  ultraSmall: 320,
  small: 375,
  medium: 414,
  tablet: 768,
  desktop: 1024,
  large: 1200
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

export interface ResponsiveState {
  width: number;
  height: number;
  breakpoint: BreakpointKey;
  isUltraSmall: boolean;
  isSmall: boolean;
  isMedium: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
  isMobile: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  devicePixelRatio: number;
  prefersReducedMotion: boolean;
  touchDevice: boolean;
}

// Helper function to determine breakpoint
const getBreakpoint = (width: number): BreakpointKey => {
  if (width <= BREAKPOINTS.ultraSmall) return 'ultraSmall';
  if (width <= BREAKPOINTS.small) return 'small';
  if (width <= BREAKPOINTS.medium) return 'medium';
  if (width <= BREAKPOINTS.tablet) return 'tablet';
  if (width <= BREAKPOINTS.desktop) return 'desktop';
  return 'large';
};

/**
 * Hook for responsive breakpoint detection and device information
 */
export const useResponsiveBreakpoints = () => {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
        breakpoint: 'desktop' as BreakpointKey,
        isUltraSmall: false,
        isSmall: false,
        isMedium: false,
        isTablet: false,
        isDesktop: true,
        isLarge: false,
        isMobile: false,
        isLandscape: true,
        isPortrait: false,
        devicePixelRatio: 1,
        prefersReducedMotion: false,
        touchDevice: false
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      width,
      height,
      breakpoint: getBreakpoint(width),
      isUltraSmall: width <= BREAKPOINTS.ultraSmall,
      isSmall: width > BREAKPOINTS.ultraSmall && width <= BREAKPOINTS.small,
      isMedium: width > BREAKPOINTS.small && width <= BREAKPOINTS.medium,
      isTablet: width > BREAKPOINTS.medium && width <= BREAKPOINTS.tablet,
      isDesktop: width > BREAKPOINTS.tablet && width <= BREAKPOINTS.desktop,
      isLarge: width > BREAKPOINTS.desktop,
      isMobile: width <= BREAKPOINTS.medium,
      isLandscape: width > height,
      isPortrait: height >= width,
      devicePixelRatio: window.devicePixelRatio || 1,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      touchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    };
  });

  const updateState = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setState({
      width,
      height,
      breakpoint: getBreakpoint(width),
      isUltraSmall: width <= BREAKPOINTS.ultraSmall,
      isSmall: width > BREAKPOINTS.ultraSmall && width <= BREAKPOINTS.small,
      isMedium: width > BREAKPOINTS.small && width <= BREAKPOINTS.medium,
      isTablet: width > BREAKPOINTS.medium && width <= BREAKPOINTS.tablet,
      isDesktop: width > BREAKPOINTS.tablet && width <= BREAKPOINTS.desktop,
      isLarge: width > BREAKPOINTS.desktop,
      isMobile: width <= BREAKPOINTS.medium,
      isLandscape: width > height,
      isPortrait: height >= width,
      devicePixelRatio: window.devicePixelRatio || 1,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      touchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    });
  }, []);

  useEffect(() => {
    let timeoutId: number;
    
    const handleResize = () => {
      // Debounce resize events for performance
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateState, 100);
    };

    const handleOrientationChange = () => {
      // Handle orientation changes with a delay to ensure dimensions are updated
      setTimeout(updateState, 200);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });

    // Listen for reduced motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => updateState();
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleMotionChange);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      } else {
        mediaQuery.removeListener(handleMotionChange);
      }
    };
  }, [updateState]);

  return state;
};

/**
 * Hook for responsive CSS classes based on current breakpoint
 */
export const useResponsiveClasses = () => {
  const responsive = useResponsiveBreakpoints();

  const getNavClasses = useCallback(() => {
    const baseClasses = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300';
    
    if (responsive.isUltraSmall) {
      return `${baseClasses} nav-mobile-ultra px-2 py-2`;
    } else if (responsive.isSmall) {
      return `${baseClasses} nav-mobile-small px-3 py-2.5`;
    } else if (responsive.isMedium) {
      return `${baseClasses} nav-mobile-medium px-4 py-3`;
    } else if (responsive.isTablet) {
      return `${baseClasses} nav-tablet px-5 py-4`;
    } else if (responsive.isDesktop) {
      return `${baseClasses} nav-desktop-small px-6 py-4`;
    } else {
      return `${baseClasses} nav-desktop px-8 py-5`;
    }
  }, [responsive]);

  const getContainerClasses = useCallback(() => {
    if (responsive.isUltraSmall) {
      return 'container mx-auto px-2';
    } else if (responsive.isSmall) {
      return 'container mx-auto px-3';
    } else if (responsive.isMedium) {
      return 'container mx-auto px-4';
    } else if (responsive.isTablet) {
      return 'container mx-auto px-5';
    } else if (responsive.isDesktop) {
      return 'container mx-auto px-6';
    } else {
      return 'container mx-auto px-8';
    }
  }, [responsive]);

  const getMenuGridClasses = useCallback(() => {
    if (responsive.isUltraSmall) {
      return 'menu-grid-ultra grid grid-cols-2 gap-2';
    } else if (responsive.isSmall) {
      return 'menu-grid-small grid grid-cols-2 gap-2.5';
    } else if (responsive.isMedium) {
      return 'menu-grid-medium grid grid-cols-2 gap-3';
    } else if (responsive.isTablet) {
      return 'menu-grid-tablet grid grid-cols-3 gap-4';
    } else if (responsive.isDesktop) {
      return 'menu-grid-desktop-small grid grid-cols-4 gap-5';
    } else {
      return 'menu-grid-desktop grid grid-cols-4 gap-6';
    }
  }, [responsive]);



  const getAnimationClasses = useCallback(() => {
    if (responsive.prefersReducedMotion) {
      return 'reduce-motion';
    }
    return '';
  }, [responsive]);

  return {
    responsive,
    getNavClasses,
    getContainerClasses,
    getMenuGridClasses,
    getAnimationClasses
  };
};

/**
 * Hook for accessibility-compliant touch targets
 */
export const useTouchTargets = () => {
  const responsive = useResponsiveBreakpoints();

  const getTouchTargetClasses = useCallback((size: 'small' | 'medium' | 'large' = 'medium') => {
    const baseClasses = 'touch-target flex items-center justify-center';

    if (!responsive.touchDevice) {
      return baseClasses;
    }

    switch (size) {
      case 'small':
        return `${baseClasses} min-h-[44px] min-w-[44px]`;
      case 'medium':
        return `${baseClasses} min-h-[48px] min-w-[48px]`;
      case 'large':
        return `${baseClasses} min-h-[56px] min-w-[56px]`;
      default:
        return `${baseClasses} min-h-[44px] min-w-[44px]`;
    }
  }, [responsive]);

  return { getTouchTargetClasses };
};
