import { useEffect, lazy, Suspense } from "react";
import ModernNavigation from "@/components/ModernNavigation";
import Hero from "@/components/Hero";
import ScrollToTop from "@/components/ScrollToTop";
import { measurePerformance, getDeviceInfo } from "@/utils/performanceMonitor";

// Lazy load heavy components for better performance
const DarkMenuSection = lazy(() => import("@/components/DarkMenuSection"));
const DarkContactSection = lazy(() => import("@/components/DarkContactSection"));

const Index = () => {
  useEffect(() => {
    // Initialize performance monitoring
    measurePerformance();
    
    // Log device info for debugging
    const deviceInfo = getDeviceInfo();
    console.log('Device Info:', deviceInfo);
    
    // Add performance class to body based on device
    if (deviceInfo.isMobile) {
      document.body.classList.add('mobile-device');
    }
    if (deviceInfo.isLowEnd || deviceInfo.isSlowConnection) {
      document.body.classList.add('reduce-animations');
    }
  }, []);
  
  useEffect(() => {
    // Add smooth scrolling for anchor links with navbar offset
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          // Special handling for home section
          if (hash === '#home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            // Account for navbar height for other sections
            const offsetTop = (element as HTMLElement).offsetTop - 80;
            window.scrollTo({
              top: Math.max(0, offsetTop),
              behavior: 'smooth'
            });
          }
        }
      }
    };

    // Handle initial load
    handleHashScroll();

    // Handle hash changes
    window.addEventListener('hashchange', handleHashScroll);

    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-dark">
      <ModernNavigation />
      <main>
        <Hero />
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-primary"></div>
          </div>
        }>
          <DarkMenuSection />
          <DarkContactSection />
        </Suspense>
      </main>
      <ScrollToTop />
    </div>
  );
};

export default Index;
