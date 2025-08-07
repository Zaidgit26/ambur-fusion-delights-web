import { useState, useEffect, memo, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Phone, Award, Users, Calendar, ChefHat, Star } from "lucide-react";
import { motion, useInView, useAnimation } from "framer-motion";
import { useResponsiveBreakpoints } from "@/hooks/useResponsiveBreakpoints";
import { useDevicePerformance } from "@/hooks/usePerformanceOptimization";

// Heritage images
const heritageImages = [
  {
    url: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4np7WfWWAzLPVI-qN90NeIEwIksgM0z-YxIAS0Ew58CoALnSgqzON4Bt1dr4sZ4M0Jn6dD70gpdAXuJGKe0c50BBI0fSajgluhN7Nh2uagksDKCdKd1Um0Zbo_gwgqlWV-Jr_cCU=s1360-w1360-h1020",
    alt: "Original Ambur Briyani Restaurant Interior",
    caption: "Our Heritage Since 1967"
  },
  {
    url: "https://img.restaurantguru.com/r126-ORIGINAL-AMBUR-BRIYANI-Deluxe-A-C-since-1967-photo.jpg",
    alt: "Authentic Ambur Biryani Preparation",
    caption: "Traditional Cooking Methods"
  },
  {
    url: "https://img.restaurantguru.com/r355-ORIGINAL-AMBUR-BRIYANI-Deluxe-A-C-since-1967-image.jpg",
    alt: "Original Ambur Briyani Dining Experience",
    caption: "Family Dining Tradition"
  },
  {
    url: "https://img.restaurantguru.com/r50e-AMBUR-BRIYANI-Deluxe-A-C-since-1967-design-2022-09.jpg",
    alt: "Original Ambur Briyani Restaurant Facade",
    caption: "MC Road Landmark"
  },
  {
    url: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nphdobrRDbNuUgVIey8mnYNTxWuqSy8YSsSEhSTJOwWN0_iCYOm0VuY7QQ0wcA0H6fcu53_vztMcOgb-V1VfYfaZj23XI1bgPcAbCMoniL1vuaNTa1iPBwoJNXYv7bNsEe7skZm=s1360-w1360-h1020",
    alt: "Deluxe AC Dining Hall",
    caption: "Modern Comfort, Traditional Taste"
  }
];

// Timeline data
const timelineData = [
  { year: "1967", event: "Founded on MC Road", icon: Calendar, description: "Our journey began with a simple mission - authentic Ambur biryani" },
  { year: "1980s", event: "Family Recipe Perfected", icon: ChefHat, description: "Refined our signature blend of spices and dum cooking technique" },
  { year: "2000s", event: "Deluxe A/C Upgrade", icon: Award, description: "Enhanced dining comfort while preserving traditional flavors" },
  { year: "Today", event: "1800+ Happy Reviews", icon: Star, description: "Serving thousands of satisfied customers with the same authentic taste" }
];

const AboutSection = memo(() => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const responsive = useResponsiveBreakpoints();
  const { shouldReduceAnimations } = useDevicePerformance();

  // Auto-rotate images
  useEffect(() => {
    if (shouldReduceAnimations) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heritageImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [shouldReduceAnimations]);

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-dark via-dark/95 to-dark/90 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ED1B24' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="font-poppins text-4xl md:text-5xl text-white mb-4">
            The Legacy of Original Ambur Briyani
          </h2>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge className="bg-primary/20 text-primary border-primary/30 font-poppins">
              <Calendar className="w-3 h-3 mr-1" />
              Since 1967
            </Badge>
            <Badge className="bg-primary/20 text-primary border-primary/30 font-poppins">
              <Award className="w-3 h-3 mr-1" />
              5+ Decades of Excellence
            </Badge>
          </div>
          <p className="font-poppins text-lg text-gray-300 max-w-3xl mx-auto">
            An Authentic Taste Rooted in Tradition
          </p>
        </div>

        {/* Hero Image Carousel with Heritage Story */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Image Carousel */}
          <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden group">
            {heritageImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onLoad={() => setIsImageLoading(false)}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "/assets/hero-biryani.jpg"; // Fallback image
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-poppins text-lg font-semibold">
                    {image.caption}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {heritageImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'w-8 bg-primary' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Heritage Story */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 font-poppins leading-relaxed text-lg">
                In the heart of Ambur, nestled along MC Road, stands a culinary landmark that has carried forward the timeless legacy of Tamil Nadu's most beloved dish — <span className="text-primary font-semibold">Ambur Biryani</span>.
              </p>
              <p className="text-gray-300 font-poppins leading-relaxed">
                Established in <span className="text-primary font-semibold">1967</span>, <strong className="text-white">ORIGINAL AMBUR BRIYANI (Deluxe A/C)</strong> is more than just a restaurant — it's a living tradition, steeped in flavor, heritage, and the warmth of family cooking.
              </p>
              <p className="text-gray-300 font-poppins leading-relaxed">
                For over <span className="text-primary font-semibold">five decades</span>, this humble kitchen has perfected the art of biryani, drawing on age-old recipes passed down through generations. From the unmistakable aroma of fragrant seeraga samba rice to the tender, slow-cooked cuts of chicken and mutton, every plate tells a story of craftsmanship and devotion.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Card className="bg-dark/50 border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">1800+</p>
                  <p className="text-sm text-gray-400">Happy Reviews</p>
                </CardContent>
              </Card>
              <Card className="bg-dark/50 border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">57+</p>
                  <p className="text-sm text-gray-400">Years of Excellence</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Elegant Animated Heritage Timeline */}
        <div className="mb-16 relative">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-cormorant text-white text-center mb-16"
          >
            <span className="font-light italic">Our Journey</span>
            <span className="block text-primary font-playfair mt-2">Through Time</span>
          </motion.h3>
          
          <div className="relative max-w-6xl mx-auto">
            {/* Animated Curvy SVG Path for Desktop */}
            <svg
              className="absolute top-0 left-0 w-full h-full hidden lg:block"
              style={{ zIndex: 0 }}
              viewBox="0 0 1200 600"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M 100,100 Q 300,50 600,100 T 1100,100 Q 900,150 600,200 T 100,300 Q 300,350 600,400 T 1100,500"
                stroke="url(#gradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ED1B24" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#ED1B24" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ED1B24" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>

            {/* Timeline Items */}
            <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-y-24">
              {timelineData.map((item, index) => {
                const Icon = item.icon;
                const isLeft = index % 2 === 0;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.2,
                      ease: "easeOut"
                    }}
                    className={`relative ${isLeft ? 'lg:pr-12 lg:text-right' : 'lg:pl-12 lg:col-start-2'}`}
                  >
                    {/* Connecting Dot with Pulse Animation */}
                    <motion.div 
                      className={`absolute ${isLeft ? 'lg:right-0' : 'lg:left-0'} top-1/2 transform -translate-y-1/2 hidden lg:block`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.3, duration: 0.5 }}
                    >
                      <div className="relative">
                        <div className="w-4 h-4 bg-primary rounded-full">
                          <motion.div
                            className="absolute inset-0 bg-primary rounded-full"
                            animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Content Card with Elegant Styling */}
                    <motion.div
                      whileHover={{ scale: 1.03, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative"
                    >
                      <Card className="bg-gradient-to-br from-dark/90 to-dark/70 border-primary/20 backdrop-blur-md overflow-hidden group">
                        {/* Decorative Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <CardContent className="p-8 relative z-10">
                          {/* Year Badge with Icon */}
                          <div className={`flex items-center gap-4 mb-4 ${isLeft ? 'lg:justify-end' : ''}`}>
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                              className="p-3 bg-primary/10 rounded-full"
                            >
                              <Icon className="w-6 h-6 text-primary" />
                            </motion.div>
                            <div>
                              <h4 className="text-2xl font-playfair text-primary">{item.year}</h4>
                            </div>
                          </div>
                          
                          {/* Event Title */}
                          <h5 className="text-xl font-cormorant font-semibold text-white mb-3 italic">
                            {item.event}
                          </h5>
                          
                          {/* Description */}
                          <p className="text-gray-300 font-poppins text-sm leading-relaxed">
                            {item.description}
                          </p>
                          
                          {/* Decorative Line */}
                          <motion.div 
                            className="mt-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ delay: index * 0.3 + 0.5, duration: 0.8 }}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 lg:hidden" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-dark/80 border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <ChefHat className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">Time-Honored Recipes</h3>
              <p className="text-gray-400">
                Cooked with a unique blend of hand-ground spices, traditional dum techniques, and love.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-dark/80 border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <Award className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">Deluxe A/C Comfort</h3>
              <p className="text-gray-400">
                We blend heritage cooking with the comfort of a deluxe air-conditioned dining space.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-dark/80 border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <Users className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">Warm Hospitality</h3>
              <p className="text-gray-400">
                Every guest is welcomed like family — always with a smile, always with care.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Customer Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl font-poppins text-white text-center mb-8">What Our Guests Say</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-dark/80 border-primary/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-3">
                  "Good tasty food. Quantity and quality is good."
                </p>
                <p className="text-primary font-semibold">— Chandrakala Sri</p>
              </CardContent>
            </Card>

            <Card className="bg-dark/80 border-primary/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-3">
                  "Peaceful ambience and the biryani was spot on."
                </p>
                <p className="text-primary font-semibold">— Regular Customer</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Info */}
        <Card className="bg-dark/80 border-primary/20 backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="text-2xl font-poppins text-white text-center mb-8">Visit Us</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <Clock className="w-8 h-8 text-primary mb-3" />
                <p className="text-white font-semibold mb-1">Open Daily</p>
                <p className="text-gray-400">10 AM – 12 Midnight</p>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="w-8 h-8 text-primary mb-3" />
                <p className="text-white font-semibold mb-1">Location</p>
                <p className="text-gray-400">12, MC Road, Ambur, Tamil Nadu</p>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 text-primary mb-3" />
                <p className="text-white font-semibold mb-1">Contact</p>
                <p className="text-gray-400">+91 96779 38393</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Badge className="bg-primary/20 text-primary border-primary/30">
                ✓ Delivery Available
              </Badge>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                ✓ Credit Cards Accepted
              </Badge>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                ✓ Wheelchair Accessible
              </Badge>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                ✓ Family Friendly
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
});

AboutSection.displayName = 'AboutSection';

export default AboutSection;
