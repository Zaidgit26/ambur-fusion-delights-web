import { useCallback } from 'react';

// Simple smooth scroll function
export const smoothScrollTo = (selector: string, offset: number = 80) => {
  const element = document.querySelector(selector);
  if (element) {
    const elementTop = (element as HTMLElement).offsetTop;
    const offsetTop = Math.max(0, elementTop - offset);

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Simple hook for basic smooth scrolling
export const useSmoothScroll = () => {
  const scrollToElement = useCallback((
    selector: string,
    offset: number = 80
  ) => {
    smoothScrollTo(selector, offset);
  }, []);

  const scrollToTopFn = useCallback(() => {
    scrollToTop();
  }, []);

  return {
    scrollToElement,
    scrollToTop: scrollToTopFn
  };
};


