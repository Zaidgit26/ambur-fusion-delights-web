import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Home, UtensilsCrossed, Phone, Menu, X, ChevronDown, Star, Clock, MapPin } from 'lucide-react';
import logo from '@/assets/logo.png';

interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  ariaLabel: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    name: 'Home',
    href: '#home',
    icon: Home,
    ariaLabel: 'Navigate to home section'
  },
  {
    id: 'menu',
    name: 'Menu',
    href: '#menu',
    icon: UtensilsCrossed,
    ariaLabel: 'Navigate to menu section'
  },
  {
    id: 'contact',
    name: 'Contact',
    href: '#contact',
    icon: Phone,
    ariaLabel: 'Navigate to contact section'
  }
];

const ModernNavigation = memo(() => {
  const [activeItem, setActiveItem] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Start hidden
  const [isScrolled, setIsScrolled] = useState(false);
  const [showQuickInfo, setShowQuickInfo] = useState(false);
  
  const { scrollY } = useScroll();
  
  // Advanced scroll detection
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    const direction = latest > previous ? "down" : "up";
    
    // Get hero section height to determine when to show nav
    const heroSection = document.querySelector('#home');
    const heroHeight = heroSection ? heroSection.clientHeight : window.innerHeight;
    
    // Only show navigation after scrolling past hero section
    if (latest > heroHeight - 100) {
      setIsVisible(true);
      setIsScrolled(true);
    } else {
      // Completely hide navigation when in hero section
      setIsVisible(false);
      setIsScrolled(false);
    }
    
    // Detect active section
    const sections = ['home', 'menu', 'contact'];
    let currentSection = 'home';
    
    // Only detect sections when nav is visible (outside hero)
    if (latest > heroHeight - 100) {
      sections.forEach(sectionId => {
        const section = document.querySelector(`#${sectionId}`);
        if (section && sectionId !== 'home') {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = sectionId;
          }
        }
      });
    }
    
    setActiveItem(currentSection);
  });

  const handleNavigation = useCallback((item: NavigationItem) => {
    setActiveItem(item.id);
    setIsMenuOpen(false);
    
    const element = document.querySelector(item.href);
    if (element) {
      // For home, scroll to top
      if (item.id === 'home') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        // For other sections, scroll to the top of the element
        const elementTop = (element as HTMLElement).offsetTop;
        window.scrollTo({
          top: elementTop,
          behavior: 'smooth'
        });
      }
    }
  }, []);

  // Close menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when menu is open on mobile
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
        className={`fixed top-0 left-0 right-0 z-50 ${
          isScrolled 
            ? 'bg-dark/95 backdrop-blur-xl border-b border-dark-border shadow-2xl' 
            : 'bg-transparent'
        } transition-all duration-300 ${
          !isVisible ? 'pointer-events-none' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
            {/* Logo Section */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleNavigation(navigationItems[0])}
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-red-primary to-red-light rounded-full blur-lg opacity-50"
                />
                <img
                  src={logo}
                  alt="Original Ambur Briyani"
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain relative z-10"
                />
              </div>
              
              <div className="hidden sm:flex flex-col">
                <span className="text-white-off font-playfair text-lg font-bold tracking-tight">
                  Original Ambur Briyani
                </span>
                <span className="text-white-muted font-poppins text-xs">
                  Authentic Taste Since Forever
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavigation(item)}
                    className="relative px-6 py-3 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Background animation */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="navIndicator"
                          className="absolute inset-0 bg-gradient-to-r from-red-primary to-red-dark rounded-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </AnimatePresence>
                    
                    {/* Content */}
                    <div className={`relative flex items-center space-x-2 ${
                      isActive ? 'text-white' : 'text-white-muted hover:text-white'
                    } transition-colors duration-300`}>
                      <Icon size={18} />
                      <span className="font-poppins font-medium text-sm">{item.name}</span>
                    </div>
                    
                    {/* Hover effect */}
                    {!isActive && (
                      <motion.div
                        className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    )}
                  </motion.button>
                );
              })}
              
              {/* Quick Info Dropdown */}
              <div className="relative ml-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowQuickInfo(!showQuickInfo)}
                  className="flex items-center space-x-2 px-4 py-2 bg-dark-card border border-dark-border rounded-full text-white-muted hover:text-white-off transition-colors"
                >
                  <Star size={16} />
                  <span className="font-poppins text-sm">Quick Info</span>
                  <ChevronDown size={16} className={`transform transition-transform ${showQuickInfo ? 'rotate-180' : ''}`} />
                </motion.button>
                
                <AnimatePresence>
                  {showQuickInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        <div className="flex items-center space-x-3">
                          <Clock className="text-red-primary" size={20} />
                          <div>
                            <p className="text-white-off font-poppins text-sm font-medium">Open Hours</p>
                            <p className="text-white-muted text-xs">10:00 AM - 12:00 AM</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="text-red-primary" size={20} />
                          <div>
                            <p className="text-white-off font-poppins text-sm font-medium">Location</p>
                            <p className="text-white-muted text-xs">Ambur, Tamil Nadu</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="text-red-primary" size={20} />
                          <div>
                            <p className="text-white-off font-poppins text-sm font-medium">Call Us</p>
                            <p className="text-white-muted text-xs">+91 96779 38393</p>
                            <p className="text-white-muted text-xs">+91 86672 87022</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 bg-dark-card border border-dark-border rounded-xl text-white-off"
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-80 bg-dark-light border-l border-dark-border z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-white-off font-playfair text-2xl">Menu</h2>
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 bg-dark-card border border-dark-border rounded-xl text-white-off"
                  >
                    <X size={24} />
                  </motion.button>
                </div>
                
                {/* Navigation Items */}
                <div className="space-y-2">
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.id;
                    
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleNavigation(item)}
                        className={`w-full p-4 rounded-2xl flex items-center space-x-4 transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-r from-red-primary to-red-dark text-white' 
                            : 'bg-dark-card border border-dark-border text-white-muted hover:text-white-off hover:border-red-primary/50'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-poppins font-medium">{item.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
                
                {/* Quick Info Section */}
                <div className="mt-8 p-6 bg-dark-card border border-dark-border rounded-2xl">
                  <h3 className="text-white-off font-playfair text-xl mb-4">Restaurant Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Clock className="text-red-primary mt-1" size={18} />
                      <div>
                        <p className="text-white-off font-poppins text-sm font-medium">Open Hours</p>
                        <p className="text-white-muted text-xs">Every day: 10:00 AM - 12:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="text-red-primary mt-1" size={18} />
                      <div>
                        <p className="text-white-off font-poppins text-sm font-medium">Location</p>
                        <p className="text-white-muted text-xs">Ambur, Tamil Nadu</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="text-red-primary mt-1" size={18} />
                      <div>
                        <p className="text-white-off font-poppins text-sm font-medium">Contact</p>
                        <p className="text-white-muted text-xs">+91 96779 38393</p>
                        <p className="text-white-muted text-xs">+91 86672 87022</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Logo Section */}
                <div className="mt-8 text-center">
                  <img
                    src={logo}
                    alt="Original Ambur Briyani"
                    className="w-20 h-20 mx-auto mb-3"
                  />
                  <p className="text-white-off font-playfair text-lg">Original Ambur Briyani</p>
                  <p className="text-white-muted font-poppins text-xs">Deluxe Restaurant</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

ModernNavigation.displayName = 'ModernNavigation';

export default ModernNavigation;
