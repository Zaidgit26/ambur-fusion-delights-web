import { useEffect } from "react";
import AnimeNavbar from "@/components/ui/anime-navbar";
import Hero from "@/components/Hero";
import FeaturedDish from "@/components/FeaturedDish";
import MenuSection from "@/components/MenuSection";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

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
            const offsetTop = element.offsetTop - 80;
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
      <AnimeNavbar />
      <main>
        <Hero />
        <FeaturedDish />
        <MenuSection />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
