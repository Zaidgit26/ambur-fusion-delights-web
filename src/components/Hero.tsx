import heroImage from "@/assets/hero-biryani.jpg";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Direct Video Background Implementation */}
      <div className="absolute inset-0">
        {/* Fallback Background Image with Animation */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-slow-zoom"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadStart={() => console.log('Video load start')}
          onLoadedData={() => {
            console.log('Video loaded successfully');
            // Make video visible when loaded
            const video = document.querySelector('video');
            if (video) video.style.opacity = '1';
          }}
          onError={(e) => {
            console.error('Video error:', e);
            console.error('Video src:', (e.target as HTMLVideoElement)?.src);
          }}
          onCanPlay={() => console.log('Video can play')}
          onCanPlayThrough={() => console.log('Video can play through')}
          style={{ opacity: 0, transition: 'opacity 0.5s ease-in-out' }}
        >
          <source src="/video/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/50 to-black/40" />
      </div>



      {/* Top Right Restaurant Name */}
      <div className="absolute top-8 right-8 z-20 text-right">
        <h2 className="font-spirax text-2xl md:text-3xl text-white mb-1">
          Original Ambur Briyani
        </h2>
        <p className="font-spirax text-lg md:text-xl text-golden-rice">
          Deluxe
        </p>
        <p className="font-poppins text-sm text-white/80 mt-1">
          Since 1967
        </p>
      </div>

      {/* Center Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Main Title */}
        <h1 className="font-spirax text-4xl md:text-6xl lg:text-7xl text-white mb-4 leading-tight">
          The taste of authentic
        </h1>

        {/* Subtitle */}
        <h2 className="font-spirax text-3xl md:text-4xl lg:text-5xl text-red-500 mb-12">
          Ambur Briyani
        </h2>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="outline"
            size="lg"
            className="font-poppins-medium bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 rounded-lg transition-all duration-300 min-w-[140px]"
          >
            MENU
          </Button>

          <Button
            size="lg"
            className="font-poppins-medium bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition-all duration-300 min-w-[140px]"
          >
            ORDER ONLINE
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;