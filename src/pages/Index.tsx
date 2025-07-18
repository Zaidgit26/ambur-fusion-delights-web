import { useEffect } from "react";
import Navigation from "@/components/ui/navigation";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import Contact from "@/components/Contact";

const Index = () => {
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
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <MenuSection />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
