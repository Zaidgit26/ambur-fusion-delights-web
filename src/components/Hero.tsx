import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

// Assets are now in public folder
const heroImage = "/assets/hero-biryani.jpg";
const logo = "/assets/logo.png";
const textLogo = "/assets/TEXTLOGO.png";

const Hero = () => {
  // Navigation handlers - Updated to match navbar behavior
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      const elementTop = (element as HTMLElement).offsetTop;
      let scrollTop;
      
      // For menu and contact sections, scroll to show them completely
      if (sectionId === '#menu' || sectionId === '#contact') {
        // Add small offset to ensure clean section view without previous section
        scrollTop = elementTop - 20;
      } else {
        // For home section, scroll to top
        scrollTop = 0;
      }
      
      window.scrollTo({
        top: Math.max(0, scrollTop),
        behavior: 'smooth'
      });
    }
  };

  const handleMenuClick = () => {
    scrollToSection('#menu');
  };

  const handleOrderClick = () => {
    // Scroll to menu section for ordering
    scrollToSection('#menu');
  };
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden z-30">
      {/* Video Background - Fixed Implementation */}
      <div className="absolute inset-0">
        {/* Fallback Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={{ opacity: 0.9 }}
          onError={(e) => {
            console.error('Video loading error:', e);
            // Hide video on error, fallback image will show
            e.currentTarget.style.display = 'none';
          }}
          onLoadedData={(e) => {
            console.log('Video loaded successfully');
            e.currentTarget.style.opacity = '0.9';
          }}
        >
          <source src="/video/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Enhanced Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/75 to-black/65" />
      </div>

      {/* Mobile Centered Logos */}
      <div className="block md:hidden absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        {/* AB Star Logo - Mobile Center Top */}
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16">
            <img
              src={logo}
              alt="Original Ambur Briyani Logo"
              className="w-full h-full object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback to a default image or hide if logo fails to load
                const target = e.currentTarget as HTMLImageElement;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%23ED1B24'/%3E%3Ctext x='32' y='40' text-anchor='middle' fill='white' font-size='24'%3E🍛%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>

        {/* Text Logo - Mobile Center Below */}
        <div className="flex justify-center">
          <div className="w-40 h-auto">
            <img
              src={textLogo}
              alt="Original Ambur Briyani Deluxe - Since 1967"
              className="w-full h-full object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Corner Logos */}
      <div className="hidden md:block">
        {/* Top Left Logo */}
        <div className="absolute top-8 left-8 z-20">
          <div className="w-20 h-20 lg:w-24 lg:h-24">
            <img
              src={logo}
              alt="Original Ambur Briyani Logo"
              className="w-full h-full object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback to a default image or hide if logo fails to load
                const target = e.currentTarget as HTMLImageElement;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Ccircle cx='48' cy='48' r='45' fill='%23ED1B24'/%3E%3Ctext x='48' y='58' text-anchor='middle' fill='white' font-size='32'%3E🍛%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>

        {/* Top Right Text Logo */}
        <div className="absolute top-8 right-8 z-20">
          <div className="w-56 lg:w-64 xl:w-72 2xl:w-80 h-auto">
            <img
              src={textLogo}
              alt="Original Ambur Briyani Deluxe - Since 1967"
              className="w-full h-full object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Center Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Main Title */}
        <h1 className="font-spirax text-3xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-8xl text-white mb-6 leading-tight">
          The taste of authentic
        </h1>

        {/* Subtitle */}
        <h2 className="font-spirax text-2xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl mb-12 leading-tight" style={{ color: '#ED1B24' }}>
          Ambur Briyani
        </h2>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleMenuClick}
            className="font-poppins-medium bg-transparent border-2 text-white px-8 py-3 rounded-lg transition-all duration-300 min-w-[140px]"
            style={{
              borderColor: '#ED1B24',
              color: '#ED1B24',
              '--hover-bg': '#ED1B24'
            } as React.CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ED1B24';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ED1B24';
            }}
          >
            MENU
          </Button>

          <Button
            size="lg"
            onClick={handleOrderClick}
            className="font-poppins-medium text-white px-8 py-3 rounded-lg transition-all duration-300 min-w-[140px]"
            style={{
              backgroundColor: '#ED1B24',
              '--hover-bg': '#C41620'
            } as React.CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C41620';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ED1B24';
            }}
          >
            ORDER ONLINE
          </Button>
        </div>
        
        {/* Order Now Arrow Button */}
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={handleOrderClick}
            variant="ghost"
            size="lg"
            className="group font-poppins-medium text-white/80 hover:text-white transition-all duration-300 flex flex-col items-center gap-2 p-6 hover:bg-transparent"
          >
            <span className="text-sm tracking-wide hover:text-primary transition-colors duration-300">ORDER NOW</span>
            <ArrowDown className="w-6 h-6 group-hover:animate-bounce group-hover:text-primary transition-colors duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;