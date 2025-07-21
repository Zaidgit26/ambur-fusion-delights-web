import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, UtensilsCrossed, Phone, Menu, X } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useScrollOptimized, useSmoothScroll, useFocusTrap } from '@/hooks/useScrollOptimized';
import { useOptimizedAnimations, useGPUAcceleration } from '@/hooks/useAnimationOptimization';
import { useResponsiveClasses, useTouchTargets } from '@/hooks/useResponsiveBreakpoints';

// TypeScript interfaces for better type safety
interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  ariaLabel: string;
}

interface NavigationProps {
  className?: string;
  onNavigate?: (item: NavigationItem) => void;
}

interface NavigationState {
  activeItem: string;
  isMenuOpen: boolean;
  isScrolled: boolean;
  isVisible: boolean;
  isNavigating: boolean;
}

// Navigation items configuration
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

// Performance-optimized animation variants with GPU acceleration
const createMobileMenuItemVariants = (shouldReduceAnimations: boolean) => ({
  closed: {
    opacity: 0,
    x: shouldReduceAnimations ? 0 : -10,
    transition: {
      duration: shouldReduceAnimations ? 0.05 : 0.15,
      ease: "easeOut" as const
    }
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: shouldReduceAnimations ? 0.05 : 0.2,
      ease: shouldReduceAnimations ? "linear" as const : [0.4, 0, 0.2, 1] as const
    }
  }
});

const Navigation: React.FC<NavigationProps> = memo(({ className = "", onNavigate }) => {
  // State management with proper typing
  const [state, setState] = useState<NavigationState>({
    activeItem: 'home',
    isMenuOpen: false,
    isScrolled: false,
    isVisible: true,
    isNavigating: false
  });

  // Performance and optimization hooks
  const { scrollToElement, scrollToTop, enhancedScrollToElement } = useSmoothScroll();
  const focusTrapRef = useFocusTrap(state.isMenuOpen);
  const {
    navigationVariants,
    mobileMenuVariants,
    buttonVariants,
    shouldReduceAnimations
  } = useOptimizedAnimations();
  const { getGPUStyles } = useGPUAcceleration();
  const { getNavClasses } = useResponsiveClasses();
  const { getTouchTargetClasses } = useTouchTargets();

  // Create optimized variants for mobile menu items
  const optimizedMobileMenuItemVariants = useMemo(() =>
    createMobileMenuItemVariants(shouldReduceAnimations),
    [shouldReduceAnimations]
  );

  // GPU-accelerated styles
  const gpuStyles = useMemo(() => getGPUStyles(!shouldReduceAnimations), [getGPUStyles, shouldReduceAnimations]);

  // Enhanced scroll handler with section-based visibility and performance optimization
  useScrollOptimized(
    useCallback((scrollState) => {
      // Determine if we should show the navbar based on current section
      const heroSection = document.querySelector('#home');
      const menuSection = document.querySelector('#menu');

      let shouldShowNavbar = false;

      if (heroSection && menuSection) {
        const heroHeight = heroSection.getBoundingClientRect().height;
        const heroBottom = (heroSection as HTMLElement).offsetTop + heroHeight;

        // Show navbar only when user has scrolled past the hero section
        // Add a small buffer (100px) to ensure smooth transition
        shouldShowNavbar = scrollState.scrollY > (heroBottom - 100);
      } else {
        // Fallback: show after scrolling 50px if sections not found
        shouldShowNavbar = scrollState.scrollY > 50;
      }

      setState(prev => ({
        ...prev,
        isScrolled: scrollState.isScrolled,
        isVisible: shouldShowNavbar
      }));
    }, []),
    { threshold: 50, throttleMs: shouldReduceAnimations ? 50 : 16 } // Adjust throttling based on performance
  );

  // Navigation click handler with enhanced mobile scrolling
  const handleNavigation = useCallback((item: NavigationItem, isMobile: boolean = false) => {
    setState(prev => ({
      ...prev,
      activeItem: item.id,
      isMenuOpen: false,
      isNavigating: true
    }));

    // Custom callback for parent components
    onNavigate?.(item);

    // Enhanced scroll implementation with mobile detection
    const onScrollComplete = () => {
      setState(prev => ({ ...prev, isNavigating: false }));
    };

    if (item.id === 'home' || item.href === '#home') {
      if (isMobile) {
        // Enhanced scroll to top for mobile
        enhancedScrollToElement('#home', 0, onScrollComplete);
      } else {
        scrollToTop();
        setTimeout(onScrollComplete, 1000);
      }
    } else {
      if (isMobile) {
        // Use enhanced two-phase scrolling for mobile
        enhancedScrollToElement(item.href, 80, onScrollComplete);
      } else {
        // Standard smooth scroll for desktop
        scrollToElement(item.href, 80);
        setTimeout(onScrollComplete, 1000);
      }
    }
  }, [onNavigate, scrollToTop, scrollToElement, enhancedScrollToElement]);

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setState(prev => ({ ...prev, isMenuOpen: !prev.isMenuOpen }));
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isMenuOpen) {
        setState(prev => ({ ...prev, isMenuOpen: false }));
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [state.isMenuOpen]);

  if (!state.isVisible) return null;

  return (
    <div>
      <motion.nav
        variants={navigationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`fixed top-4 left-2 right-2 sm:left-3 sm:right-3 lg:left-4 lg:right-4 z-50 transition-all duration-500 rounded-2xl ${
          state.isScrolled
            ? 'navbar-scrolled-glass'
            : 'navbar-glass-morphism'
        } ${className}`}
        style={getGPUStyles()}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="w-full">
          <div className="flex items-center justify-between h-16 sm:h-18 px-4">
            {/* Logo and Brand */}
            <motion.div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleNavigation(navigationItems[0], false)}
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              style={getGPUStyles()}
              role="button"
              tabIndex={0}
              aria-label="Original Ambur Briyani - Go to home"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigation(navigationItems[0], false);
                }
              }}
            >
              {/* Logo Image */}
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
                variants={{
                  hover: { rotate: 5, scale: 1.05 }
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <img
                  src={logo}
                  alt="Original Ambur Briyani Logo"
                  className="w-full h-full object-contain drop-shadow-lg"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23ED1B24'/%3E%3Ctext x='24' y='30' text-anchor='middle' fill='white' font-size='20'%3E🍛%3C/text%3E%3C/svg%3E";
                  }}
                />
              </motion.div>

              {/* Brand Text */}
              <div className="flex flex-col">
                <motion.span
                  className="text-white font-poppins-bold text-sm sm:text-base navbar-brand-text leading-tight"
                  variants={{
                    hover: { color: "#ED1B24" }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Original Ambur Briyani
                </motion.span>
                <motion.span
                  className="text-white/80 font-poppins text-xs sm:text-sm navbar-brand-text subtitle leading-tight"
                  variants={{
                    hover: { color: "#009949" }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Deluxe
                </motion.span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = state.activeItem === item.id;

                return (
                  <motion.div
                    key={item.id}
                    className="relative"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.button
                      onClick={() => handleNavigation(item, false)}
                      className="relative px-3 py-2 rounded-xl font-poppins-medium text-sm focus:outline-none overflow-hidden"
                      whileHover="hover"
                      whileTap="tap"
                      variants={{
                        hover: { scale: 1.02 },
                        tap: { scale: 0.98 }
                      }}
                      aria-label={item.ariaLabel}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {/* Active background */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 nav-item-active rounded-xl"
                          layoutId="activeBackground"
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                      )}

                      {/* Hover background */}
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        variants={{
                          hover: {
                            backgroundColor: "rgba(237, 27, 36, 0.15)",
                            backdropFilter: "blur(8px)"
                          }
                        }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Content */}
                      <div className="relative z-10 flex items-center space-x-2">
                        <motion.div
                          variants={{
                            hover: { color: "#ED1B24" }
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          style={{
                            color: isActive ? "#ED1B24" : "rgba(255, 255, 255, 0.9)"
                          }}
                        >
                          <Icon size={18} />
                        </motion.div>
                        <motion.span
                          className="font-poppins-medium"
                          variants={{
                            hover: { color: "#ED1B24" }
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          style={{
                            color: isActive ? "#ED1B24" : "rgba(255, 255, 255, 0.9)"
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

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-2">

              {/* Mobile Menu Button */}
              <motion.button
                onClick={toggleMobileMenu}
                className="relative p-2 rounded-xl focus:outline-none overflow-hidden"
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                aria-label={state.isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={state.isMenuOpen}
                aria-controls="mobile-menu"
              >
                {/* Hover background */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  variants={{
                    hover: {
                      backgroundColor: "rgba(237, 27, 36, 0.15)",
                      backdropFilter: "blur(8px)"
                    }
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Icon */}
                <motion.div
                  className="relative z-10"
                  variants={{
                    hover: { color: "#ED1B24" }
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ color: "rgba(255, 255, 255, 0.9)" }}
                >
                  {state.isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu - Performance Optimized */}
          <AnimatePresence mode="wait">
            {state.isMenuOpen && (
              <motion.div
                key="mobile-menu"
                id="mobile-menu"
                ref={focusTrapRef as React.RefObject<HTMLDivElement>}
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="md:hidden overflow-hidden border-t border-white/10 backdrop-blur-sm"
                style={{
                  ...gpuStyles,
                  contain: 'layout style paint'
                }}
                role="menu"
              >
                <div className="px-4 py-3 space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = state.activeItem === item.id;

                    return (
                      <motion.div
                        key={item.id}
                        variants={optimizedMobileMenuItemVariants}
                        style={gpuStyles}
                      >
                        <motion.button
                          onClick={() => handleNavigation(item, true)}
                          className="relative w-full px-4 py-3 rounded-xl font-poppins-medium text-left focus:outline-none overflow-hidden"
                          whileHover="hover"
                          whileTap="tap"
                          variants={{
                            hover: { x: 4, scale: 1.01 },
                            tap: { scale: 0.98 }
                          }}
                          role="menuitem"
                          aria-label={item.ariaLabel}
                        >
                          {/* Active background */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 nav-item-active rounded-xl"
                              layoutId="mobileActiveBackground"
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            />
                          )}

                          {/* Hover background */}
                          <motion.div
                            className="absolute inset-0 rounded-xl"
                            variants={{
                              hover: {
                                backgroundColor: "rgba(237, 27, 36, 0.15)",
                                backdropFilter: "blur(8px)"
                              }
                            }}
                            transition={{ duration: 0.3 }}
                          />

                          {/* Content */}
                          <div className="relative z-10 flex items-center space-x-2">
                            <motion.div
                              variants={{
                                hover: { color: "#ED1B24" }
                              }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              style={{
                                color: isActive ? "#ED1B24" : "rgba(255, 255, 255, 0.9)"
                              }}
                            >
                              <Icon size={20} />
                            </motion.div>
                            <motion.span
                              className="text-base font-poppins-medium"
                              variants={{
                                hover: { color: "#ED1B24" }
                              }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              style={{
                                color: isActive ? "#ED1B24" : "rgba(255, 255, 255, 0.9)"
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
    </div>
  );
});

export default Navigation;
