import { useState, useEffect, useCallback, RefObject } from 'react';

interface Position {
  top: number;
  left: number;
  right: number;
  transform: string;
}

interface UseResponsivePositionOptions {
  offset?: number;
  preferredSide?: 'left' | 'right';
  minMargin?: number;
}

/**
 * Hook for responsive positioning of dropdowns relative to trigger elements
 */
export const useResponsivePosition = (
  triggerRef: RefObject<HTMLElement>,
  isOpen: boolean,
  options: UseResponsivePositionOptions = {}
) => {
  const { offset = 8, preferredSide = 'right', minMargin = 16 } = options;
  const [position, setPosition] = useState<Position>({
    top: 0,
    left: 0,
    right: 0,
    transform: 'translateX(0)'
  });

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !isOpen) return;

    const trigger = triggerRef.current;
    const rect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Dropdown dimensions (estimated)
    const dropdownWidth = viewportWidth < 640 ? viewportWidth - (minMargin * 2) : 384; // 96 * 4 = 384px
    const dropdownHeight = 400; // Estimated max height

    let top = rect.bottom + offset;
    let left = 0;
    let right = 0;
    let transform = 'translateX(0)';

    // Handle mobile screens (< 640px)
    if (viewportWidth < 640) {
      // Full width with margins on mobile
      left = minMargin;
      right = minMargin;
      transform = 'translateX(0)';
    } else {
      // Desktop/tablet positioning
      if (preferredSide === 'right') {
        // Try to position from the right edge of trigger
        const rightEdge = rect.right;
        const leftPosition = rightEdge - dropdownWidth;
        
        if (leftPosition >= minMargin) {
          // Fits on the right side
          left = leftPosition;
          transform = 'translateX(0)';
        } else {
          // Doesn't fit, center it with viewport constraints
          const centeredLeft = (viewportWidth - dropdownWidth) / 2;
          left = Math.max(minMargin, Math.min(centeredLeft, viewportWidth - dropdownWidth - minMargin));
          transform = 'translateX(0)';
        }
      } else {
        // Left side positioning
        const leftEdge = rect.left;
        const rightPosition = leftEdge + dropdownWidth;
        
        if (rightPosition <= viewportWidth - minMargin) {
          // Fits on the left side
          left = leftEdge;
          transform = 'translateX(0)';
        } else {
          // Doesn't fit, center it
          const centeredLeft = (viewportWidth - dropdownWidth) / 2;
          left = Math.max(minMargin, Math.min(centeredLeft, viewportWidth - dropdownWidth - minMargin));
          transform = 'translateX(0)';
        }
      }
    }

    // Adjust vertical position if dropdown would go off-screen
    if (top + dropdownHeight > viewportHeight - minMargin) {
      // Position above the trigger if there's more space
      const spaceAbove = rect.top - minMargin;
      const spaceBelow = viewportHeight - rect.bottom - minMargin;
      
      if (spaceAbove > spaceBelow && spaceAbove >= 200) {
        top = rect.top - dropdownHeight - offset;
      } else {
        // Keep below but adjust height
        top = Math.max(minMargin, viewportHeight - dropdownHeight - minMargin);
      }
    }

    setPosition({ top, left, right, transform });
  }, [triggerRef, isOpen, offset, preferredSide, minMargin]);

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      
      // Recalculate on resize and scroll
      const handleResize = () => calculatePosition();
      const handleScroll = () => calculatePosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isOpen, calculatePosition]);

  return position;
};

/**
 * Hook for detecting mobile device and screen size
 */
export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    screenWidth: 0,
    screenHeight: 0,
    touchDevice: false
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setDeviceInfo({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
        screenWidth: width,
        screenHeight: height,
        touchDevice
      });
    };

    updateDeviceInfo();
    
    const handleResize = () => updateDeviceInfo();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceInfo;
};

/**
 * Hook for optimized touch interactions
 */
export const useTouchOptimization = () => {
  const [touchState, setTouchState] = useState({
    isTouch: false,
    touchStartTime: 0,
    touchPosition: { x: 0, y: 0 }
  });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchState({
      isTouch: true,
      touchStartTime: Date.now(),
      touchPosition: { x: touch.clientX, y: touch.clientY }
    });
  }, []);

  // keep or add this import if not already present:
  // import { useState, useCallback, useRef } from 'react';

  // 1) introduce a ref for mutable touch state
  const touchStateRef = useRef({
    isTouch: false,
    touchStartTime: 0,
    touchPosition: { x: 0, y: 0 }
  });

  // 2) existing state for any UI updates
  const [touchState, setTouchState] = useState({
    isTouch: false,
    touchStartTime: 0,
    touchPosition: { x: 0, y: 0 }
  });

  // 3) on touch start, record both ref and state
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const newState = {
      isTouch: true,
      touchStartTime: Date.now(),
      touchPosition: { x: touch.clientX, y: touch.clientY }
    };
    touchStateRef.current = newState;
    setTouchState(newState);
  }, []);

  // 4) on touch end, read from the ref so this callback can stay stable
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const touchDuration = Date.now() - touchStateRef.current.touchStartTime;
    const touch = e.changedTouches[0];
    const distance = Math.sqrt(
      Math.pow(touch.clientX - touchStateRef.current.touchPosition.x, 2) +
      Math.pow(touch.clientY - touchStateRef.current.touchPosition.y, 2)
    );

    // Consider it a tap if duration < 200ms and distance < 10px
    const isTap = touchDuration < 200 && distance < 10;
    
    setTouchState(prev => ({ ...prev, isTouch: false }));
    
    return { isTap, touchDuration, distance };
  }, []);

  return {
    touchState,
    handleTouchStart,
    handleTouchEnd,
    isTouchDevice: 'ontouchstart' in window
  };
};
