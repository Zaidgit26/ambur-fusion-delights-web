// Performance monitoring and optimization utilities

export const measurePerformance = () => {
  if (typeof window === 'undefined') return;

  // Web Vitals monitoring
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
      }
      
      // You can send these metrics to analytics
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime);
      }
      
      if (entry.entryType === 'first-input') {
        const fid = entry.processingStart - entry.startTime;
        console.log('FID:', fid);
      }
      
      if (entry.entryType === 'layout-shift') {
        console.log('CLS:', entry.value);
      }
    }
  });

  // Observe different metrics
  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  
  // Measure Time to Interactive
  if ('PerformanceObserver' in window) {
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log('FCP:', entry.startTime);
        }
      }
    });
    paintObserver.observe({ entryTypes: ['paint'] });
  }
};

// Device detection utilities
export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isChrome = /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor);
  
  // Check connection quality
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const connectionType = connection?.effectiveType || 'unknown';
  const saveData = connection?.saveData || false;
  
  // Check device memory
  const deviceMemory = (navigator as any).deviceMemory || 'unknown';
  
  // Check hardware concurrency (CPU cores)
  const hardwareConcurrency = navigator.hardwareConcurrency || 'unknown';
  
  return {
    isMobile,
    isTablet,
    isSafari,
    isChrome,
    connectionType,
    saveData,
    deviceMemory,
    hardwareConcurrency,
    isLowEnd: deviceMemory !== 'unknown' && deviceMemory <= 4,
    isSlowConnection: ['slow-2g', '2g'].includes(connectionType) || saveData
  };
};

// Image optimization based on device
export const getOptimizedImageSrc = (src: string, deviceInfo: ReturnType<typeof getDeviceInfo>) => {
  if (deviceInfo.isSlowConnection || deviceInfo.saveData) {
    // Return lower quality image for slow connections
    return src.replace(/\.(jpg|jpeg|png)$/i, '-low.$1');
  }
  
  if (deviceInfo.isMobile && !deviceInfo.isTablet) {
    // Return mobile-optimized image
    return src.replace(/\.(jpg|jpeg|png)$/i, '-mobile.$1');
  }
  
  return src;
};

// Intersection Observer for lazy loading
export const createLazyLoadObserver = (callback: (entry: IntersectionObserverEntry) => void) => {
  const options = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01
  };
  
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, options);
};

// Debounce utility for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Prefetch images for better performance
export const prefetchImages = (urls: string[]) => {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

// Request idle callback wrapper
export const requestIdleCallback = 
  window.requestIdleCallback ||
  function (cb: IdleRequestCallback) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      } as IdleDeadline);
    }, 1);
  };

// Memory management
export const cleanupMemory = () => {
  // Clear unused images from memory
  const images = document.getElementsByTagName('img');
  Array.from(images).forEach(img => {
    if (!isElementInViewport(img)) {
      img.src = '';
    }
  });
};

const isElementInViewport = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export default {
  measurePerformance,
  getDeviceInfo,
  getOptimizedImageSrc,
  createLazyLoadObserver,
  debounce,
  throttle,
  prefetchImages,
  requestIdleCallback,
  cleanupMemory
};
