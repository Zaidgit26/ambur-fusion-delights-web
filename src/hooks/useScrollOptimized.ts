import { useEffect, useCallback, useRef } from 'react';

interface UseScrollOptimizedOptions {
  threshold?: number;
  throttleMs?: number;
}

interface ScrollState {
  scrollY: number;
  isScrolled: boolean;
  direction: 'up' | 'down' | null;
}

/**
 * Optimized scroll hook with throttling and performance optimizations
 * Uses requestAnimationFrame for smooth performance
 */
export const useScrollOptimized = (
  callback: (state: ScrollState) => void,
  options: UseScrollOptimizedOptions = {}
) => {
  const { threshold = 50, throttleMs = 16 } = options; // 16ms ≈ 60fps
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const lastCallTime = useRef(0);

  const handleScroll = useCallback(() => {
    const now = Date.now();
    
    // Throttle the callback execution
    if (now - lastCallTime.current < throttleMs) {
      return;
    }

    if (!ticking.current) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const direction = scrollY > lastScrollY.current ? 'down' : 
                         scrollY < lastScrollY.current ? 'up' : null;
        
        const state: ScrollState = {
          scrollY,
          isScrolled: scrollY > threshold,
          direction
        };

        callback(state);
        
        lastScrollY.current = scrollY;
        lastCallTime.current = now;
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [callback, threshold, throttleMs]);

  useEffect(() => {
    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
};

/**
 * Hook for enhanced smooth scrolling with two-phase animation
 */
export const useSmoothScroll = () => {
  const scrollToElement = useCallback((
    selector: string,
    offset: number = 80,
    behavior: ScrollBehavior = 'smooth'
  ) => {
    const element = document.querySelector(selector);
    if (element) {
      const elementTop = (element as HTMLElement).offsetTop;
      const offsetTop = Math.max(0, elementTop - offset);

      window.scrollTo({
        top: offsetTop,
        behavior
      });
    }
  }, []);

  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top: 0,
      behavior
    });
  }, []);

  // Enhanced two-phase scrolling with blur animation
  const enhancedScrollToElement = useCallback((
    selector: string,
    offset: number = 80,
    onComplete?: () => void
  ) => {
    const element = document.querySelector(selector);
    if (!element) return;

    const elementTop = (element as HTMLElement).offsetTop;
    const targetPosition = Math.max(0, elementTop - offset);
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;

    // If already at target, just complete
    if (Math.abs(distance) < 10) {
      onComplete?.();
      return;
    }

    // Create overlay for blur effect
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0);
      backdrop-filter: blur(0px);
      z-index: 9999;
      pointer-events: none;
      transition: all 0.3s ease-out;
    `;
    document.body.appendChild(overlay);

    // Phase 1: Fast initial scroll (70% of distance)
    const phase1Target = startPosition + (distance * 0.7);
    const phase1Duration = 800; // 0.8s for fast scroll

    let startTime: number;

    const phase1Animation = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / phase1Duration, 1);

      // Ease-out cubic for fast initial scroll
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentPosition = startPosition + (distance * 0.7 * easeProgress);

      // Add blur effect during fast scroll
      const blurAmount = Math.sin(progress * Math.PI) * 8;
      overlay.style.backdropFilter = `blur(${blurAmount}px)`;
      overlay.style.background = `rgba(0, 0, 0, ${Math.sin(progress * Math.PI) * 0.1})`;

      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        requestAnimationFrame(phase1Animation);
      } else {
        // Start Phase 2: Slow revealing scroll
        startTime = 0;
        requestAnimationFrame(phase2Animation);
      }
    };

    // Phase 2: Slow revealing scroll (remaining 30%)
    const phase2Duration = 1200; // 1.2s for slow reveal

    const phase2Animation = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / phase2Duration, 1);

      // Ease-in-out for smooth revealing
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currentPosition = phase1Target + (distance * 0.3 * easeProgress);

      // Fade out blur effect during reveal
      const blurAmount = (1 - progress) * 4;
      overlay.style.backdropFilter = `blur(${blurAmount}px)`;
      overlay.style.background = `rgba(0, 0, 0, ${(1 - progress) * 0.05})`;

      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        requestAnimationFrame(phase2Animation);
      } else {
        // Complete animation
        overlay.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(overlay);
          onComplete?.();
        }, 300);
      }
    };

    // Start Phase 1
    requestAnimationFrame(phase1Animation);
  }, []);

  return { scrollToElement, scrollToTop, enhancedScrollToElement };
};

/**
 * Hook for managing focus trap in mobile menus
 */
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
};
