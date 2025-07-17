import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, UtensilsCrossed, Info, Phone, Menu, X } from 'lucide-react';

interface NavItem {
  name: string;
  url: string;
  icon: React.ComponentType<any>;
}

const items: NavItem[] = [
  { name: "Home", url: "#home", icon: Home },
  { name: "Menu", url: "#menu", icon: UtensilsCrossed },
  { name: "About", url: "#about", icon: Info },
  { name: "Contact", url: "#contact", icon: Phone }
];

const AnimeNavbar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Home');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [showNavbar, setShowNavbar] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  // Handle scroll effect and navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);

      // Show navbar only when we reach the menu section (approximately after hero section)
      const heroHeight = window.innerHeight; // Assuming hero is full viewport height
      setShowNavbar(scrollY > heroHeight * 0.8); // Show when 80% through hero section
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle active section based on scroll position
  useEffect(() => {
    const handleScrollSpy = () => {
      // Don't update active item if user is currently navigating
      if (isNavigating) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // If we're at the very top of the page (within 100px), always show Home as active
      if (scrollPosition < 100) {
        setActiveItem('Home');
        return;
      }

      const sections = items.map(item => ({
        name: item.name,
        element: document.querySelector(item.url)
      }));

      // Find the section that's currently in view
      let currentSection = null;

      for (const section of sections) {
        if (!section.element) continue;

        const rect = section.element.getBoundingClientRect();
        const elementTop = rect.top + scrollPosition;
        const elementBottom = elementTop + rect.height;

        // Account for navbar height (80px offset)
        const adjustedScrollPosition = scrollPosition + 80;

        // Check if the adjusted scroll position is within this section
        if (adjustedScrollPosition >= elementTop && adjustedScrollPosition < elementBottom) {
          currentSection = section;
          break;
        }
      }

      // If no section found but we're not at the top, find the closest one
      if (!currentSection && scrollPosition >= 100) {
        let closestSection = sections[0];
        let closestDistance = Infinity;

        for (const section of sections) {
          if (!section.element) continue;
          const rect = section.element.getBoundingClientRect();
          const distance = Math.abs(rect.top);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = section;
          }
        }
        currentSection = closestSection;
      }

      if (currentSection) {
        setActiveItem(currentSection.name);
      }
    };

    // Initial call
    handleScrollSpy();

    window.addEventListener('scroll', handleScrollSpy);
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [isNavigating]);

  const handleNavClick = (item: NavItem) => {
    setActiveItem(item.name);
    setIsMenuOpen(false);
    setIsNavigating(true);

    // Clear navigation state after scroll completes
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000); // Allow time for smooth scroll to complete

    // Special handling for Home section - scroll to top
    if (item.name === 'Home' || item.url === '#home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    // Smooth scroll to section with offset for fixed navbar
    const element = document.querySelector(item.url);
    if (element) {
      // Calculate offset accounting for navbar height and hero section padding
      const navbarHeight = 80;
      const offsetTop = element.offsetTop - navbarHeight;

      window.scrollTo({
        top: Math.max(0, offsetTop), // Ensure we don't scroll to negative position
        behavior: 'smooth'
      });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {showNavbar && (
        <>
          {/* Desktop Navigation */}
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-4 right-4 z-50 transition-all duration-500 mt-4 rounded-2xl ${
              scrolled
                ? 'navbar-scrolled'
                : 'navbar-glass'
            }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleNavClick({ name: "Home", url: "#home", icon: Home })}
              whileHover="hover"
              whileTap="tap"
              variants={{
                hover: { scale: 1.02 },
                tap: { scale: 0.98 }
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <motion.div
                className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center shadow-warm"
                variants={{
                  hover: { rotate: 15, scale: 1.1 }
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <span className="text-white font-bold text-lg">🍛</span>
              </motion.div>
              <div className="flex flex-col">
                <motion.span
                  className="font-primary-bold text-xl leading-tight"
                  variants={{
                    hover: { color: "rgb(255, 215, 0)" }
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ color: "rgb(255, 215, 0)" }}
                >
                  Original Ambur
                </motion.span>
                <motion.span
                  className="font-secondary text-xs -mt-1"
                  variants={{
                    hover: { color: "rgb(255, 140, 0)" }
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ color: "rgba(255, 140, 0, 0.8)" }}
                >
                  Briyani
                </motion.span>
              </div>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {items.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeItem === item.name;

                return (
                  <motion.div
                    key={item.name}
                    className="relative"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.button
                      onClick={() => handleNavClick(item)}
                      className="relative px-5 py-2.5 rounded-xl font-primary text-sm font-medium focus:outline-none overflow-hidden"
                      whileHover="hover"
                      whileTap="tap"
                      variants={{
                        hover: { scale: 1.02 },
                        tap: { scale: 0.98 }
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      aria-label={`Navigate to ${item.name} section`}
                    >
                      {/* Base background */}
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        initial={{ opacity: 0 }}
                        variants={{
                          hover: { opacity: 1 }
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{
                          background: "linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(255, 140, 0, 0.05))",
                          border: "1px solid rgba(255, 215, 0, 0.2)"
                        }}
                      />

                      {/* Active state background */}
                      {isActive && (
                        <motion.div
                          layoutId="activeBackground"
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: "linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 140, 0, 0.1))",
                            border: "1px solid rgba(255, 215, 0, 0.4)",
                            boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)"
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}

                      {/* Content */}
                      <div className="relative z-10 flex items-center space-x-2">
                        <motion.div
                          variants={{
                            hover: { color: "rgb(255, 215, 0)" }
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          style={{
                            color: isActive ? "rgb(255, 215, 0)" : "rgba(255, 255, 255, 0.8)"
                          }}
                        >
                          <Icon size={16} />
                        </motion.div>
                        <motion.span
                          variants={{
                            hover: { color: "rgb(255, 215, 0)" }
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          style={{
                            color: isActive ? "rgb(255, 215, 0)" : "rgba(255, 255, 255, 0.8)"
                          }}
                        >
                          {item.name}
                        </motion.span>
                      </div>

                      {/* Shine effect */}
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: "linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent)"
                        }}
                        initial={{ x: "-100%" }}
                        variants={{
                          hover: { x: "100%" }
                        }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <motion.button
              onClick={toggleMenu}
              className="md:hidden p-3 rounded-xl focus:outline-none relative overflow-hidden"
              whileHover="hover"
              whileTap="tap"
              variants={{
                hover: { scale: 1.05 },
                tap: { scale: 0.95 }
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {/* Hover background */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                initial={{ opacity: 0 }}
                variants={{
                  hover: { opacity: 1 }
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  background: "linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(255, 140, 0, 0.05))",
                  border: "1px solid rgba(255, 215, 0, 0.2)"
                }}
              />

              {/* Icon */}
              <motion.div
                className="relative z-10"
                variants={{
                  hover: { color: "rgb(255, 215, 0)" }
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </motion.button>
          </div>

          {/* Mobile Menu Dropdown - Integrated within navbar */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden border-t border-golden-rice/20"
              >
                <div className="px-4 py-4 space-y-3">
                  {items.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.name;

                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.button
                          onClick={() => handleNavClick(item)}
                          className="relative w-full px-4 py-3 rounded-xl font-primary text-left focus:outline-none overflow-hidden"
                          whileHover="hover"
                          whileTap="tap"
                          variants={{
                            hover: { x: 4, scale: 1.01 },
                            tap: { scale: 0.98 }
                          }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          aria-label={`Navigate to ${item.name} section`}
                        >
                          {/* Base background */}
                          <motion.div
                            className="absolute inset-0 rounded-xl"
                            initial={{ opacity: 0 }}
                            variants={{
                              hover: { opacity: 1 }
                            }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            style={{
                              background: "linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(255, 140, 0, 0.05))",
                              border: "1px solid rgba(255, 215, 0, 0.2)"
                            }}
                          />

                          {/* Active state background */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-xl"
                              style={{
                                background: "linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 140, 0, 0.1))",
                                border: "1px solid rgba(255, 215, 0, 0.4)",
                                boxShadow: "0 0 15px rgba(255, 215, 0, 0.2)"
                              }}
                              initial={false}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}

                          {/* Content */}
                          <div className="relative z-10 flex items-center space-x-3">
                            <motion.div
                              variants={{
                                hover: { color: "rgb(255, 215, 0)" }
                              }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              style={{
                                color: isActive ? "rgb(255, 215, 0)" : "rgba(255, 255, 255, 0.8)"
                              }}
                            >
                              <Icon size={20} />
                            </motion.div>
                            <motion.span
                              className="text-base font-medium"
                              variants={{
                                hover: { color: "rgb(255, 215, 0)" }
                              }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              style={{
                                color: isActive ? "rgb(255, 215, 0)" : "rgba(255, 255, 255, 0.8)"
                              }}
                            >
                              {item.name}
                            </motion.span>
                          </div>
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
        </>
      )}

      {/* Anime Mascot Character */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 hidden lg:block"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, duration: 0.8, type: "spring" }}
      >
        <motion.div
          className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center shadow-warm cursor-pointer mascot-glow"
          whileHover={{ scale: 1.15, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            y: [0, -12, 0],
            rotate: [0, 8, -8, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span className="text-2xl">🍛</span>
        </motion.div>
        
        {/* Floating particles */}
        <motion.div
          className="absolute -top-2 -right-2 w-3 h-3 bg-saffron rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: 0.5
          }}
        />
        <motion.div
          className="absolute -bottom-1 -left-1 w-2 h-2 bg-golden-rice rounded-full"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            delay: 1
          }}
        />
      </motion.div>
    </>
  );
};

export default AnimeNavbar;
