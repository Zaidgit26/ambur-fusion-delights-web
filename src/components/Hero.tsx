import { Button } from "@/components/ui/button";
import { Star, Clock, MapPin, ChefHat } from "lucide-react";
import heroImage from "@/assets/hero-biryani.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="fade-in-up">
          {/* Restaurant Badge */}
          <div className="inline-flex items-center space-x-2 bg-background/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <ChefHat className="w-5 h-5 text-golden-rice" />
            <span className="text-golden-rice font-medium">Authentic South Indian Cuisine</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Experience the
            <span className="block text-golden-rice">Legendary Ambur</span>
            <span className="block">Briyani</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Savor the authentic flavors of traditional Ambur biryani, crafted with aromatic spices, 
            premium basmati rice, and tender meat, served with love since generations.
          </p>
          
          {/* Features */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-white/80">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-golden-rice fill-current" />
              <span>4.8★ Rated</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-golden-rice" />
              <span>30 min delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-golden-rice" />
              <span>Free delivery</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4 scale-on-hover">
              Order Online Now
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 scale-on-hover">
              View Menu
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-3 h-3 bg-golden-rice rounded-full animate-bounce delay-100"></div>
      <div className="absolute top-1/3 right-16 w-2 h-2 bg-saffron rounded-full animate-bounce delay-300"></div>
      <div className="absolute bottom-1/4 left-20 w-4 h-4 bg-primary-glow rounded-full animate-bounce delay-500"></div>
    </section>
  );
};

export default Hero;