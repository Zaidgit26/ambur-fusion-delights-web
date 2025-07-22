import React, { useState, useEffect, useCallback, memo } from 'react';
import { Home, UtensilsCrossed, Phone, Menu, X } from 'lucide-react';
import logo from '@/assets/logo.png';

// TypeScript interfaces
interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<any>;
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

// Enhanced smooth scroll function with better section alignment
const smoothScrollTo = (selector: string, offset: number = 0) => {
  const element = document.querySelector(selector);
  if (element) {
    const elementTop = (element as HTMLElement).offsetTop;
    let scrollTop;
    
    // For menu and contact sections, scroll to show them completely
    if (selector === '#menu' || selector === '#contact') {
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

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const Navigation: React.FC<NavigationProps> = memo(({ className = "", onNavigate }) => {
  // Simple state management
  const [state, setState] = useState<NavigationState>({
    activeItem: 'home',
    isMenuOpen: false,
    isScrolled: false,
    isVisible: false
  });

  // Simple scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sections = ['home', 'menu', 'contact'];
      let currentSectionId = 'home';
      let shouldShowNavbar = false;
      
      // Determine which section is currently in view
      sections.forEach(sectionId => {
        const section = document.querySelector(`#${sectionId}`);
        if (section) {
          const sectionTop = (section as HTMLElement).offsetTop;
          const sectionHeight = section.getBoundingClientRect().height;
          
          // Check if we're in this section (with offset for navbar and better UX)
          // The section is considered active if we're within its boundaries minus some offset
          const offset = 150; // Offset for smoother transitions
          if (scrollY >= sectionTop - offset && scrollY < sectionTop + sectionHeight - offset) {
            currentSectionId = sectionId;
          }
        }
      });

      const heroSection = document.querySelector('#home');

      if (heroSection) {
        // Get the hero section's current position and height
        const heroRect = heroSection.getBoundingClientRect();
        const heroTop = (heroSection as HTMLElement).offsetTop;
        const heroHeight = heroRect.height;
        const heroBottom = heroTop + heroHeight;
        
        // Show navbar only when we've scrolled past the hero section
        shouldShowNavbar = scrollY >= (heroBottom - 50);
      } else {
        shouldShowNavbar = scrollY > 100;
      }

      setState(prev => ({
        ...prev,
        activeItem: currentSectionId,
        isScrolled: scrollY > 50,
        isVisible: shouldShowNavbar
      }));
    };

    // Call handleScroll initially to set correct state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Simple navigation click handler
  const handleNavigation = useCallback((item: NavigationItem) => {
    setState(prev => ({
      ...prev,
      activeItem: item.id,
      isMenuOpen: false
    }));

    // Custom callback for parent components
    onNavigate?.(item);

    // Simple smooth scroll
    if (item.id === 'home' || item.href === '#home') {
      scrollToTop();
    } else {
      smoothScrollTo(item.href, 80);
    }
  }, [onNavigate]);

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

  return (
    <div>
      <nav
        className={`fixed top-4 left-2 right-2 sm:left-3 sm:right-3 lg:left-4 lg:right-4 z-40 rounded-2xl ${state.isScrolled ? 'navbar-scrolled-glass' : 'navbar-glass-morphism'} ${className} ${
          state.isVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 -translate-y-full scale-95 pointer-events-none'
        } transition-all duration-700 ease-out`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="w-full">
          <div className="flex items-center justify-between h-16 sm:h-18 px-4">
            {/* Logo and Brand */}
            <div
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity duration-300"
              onClick={() => handleNavigation(navigationItems[0])}
              role="button"
              tabIndex={0}
              aria-label="Original Ambur Briyani - Go to home"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigation(navigationItems[0]);
                }
              }}
            >
              {/* Logo Image */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                <img
                  src={logo}
                  alt="Original Ambur Briyani Logo"
                  className="w-full h-full object-contain drop-shadow-lg"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23ED1B24'/%3E%3Ctext x='24' y='30' text-anchor='middle' fill='white' font-size='20'%3E🍛%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>

              {/* Brand Text */}
              <div className="flex flex-col">
                <span className="text-white font-poppins-bold text-sm sm:text-base navbar-brand-text leading-tight">
                  Original Ambur Briyani
                </span>
                <span className="text-white/80 font-poppins text-xs sm:text-sm navbar-brand-text subtitle leading-tight">
                  Deluxe
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = state.activeItem === item.id;

                return (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => handleNavigation(item)}
                      className={`relative px-3 py-2 rounded-xl font-poppins-medium text-sm focus:outline-none nav-item-transition ${
                        isActive
                          ? 'nav-item-active text-white'
                          : 'text-white/90 hover:text-white hover:bg-red-600/20'
                      }`}
                      aria-label={item.ariaLabel}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="transition-colors duration-300">
                          <Icon size={16} />
                        </div>
                        <span className="transition-colors duration-300">{item.name}</span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="relative p-2 rounded-xl focus:outline-none transition-all duration-300 hover:bg-red-600/20"
                aria-label={state.isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={state.isMenuOpen}
                aria-controls="mobile-menu"
              >
                <div className="text-white/90 hover:text-white transition-colors duration-300">
                  {state.isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {state.isMenuOpen && (
            <div
              id="mobile-menu"
              className="md:hidden border-t border-white/10 backdrop-blur-sm"
              role="menu"
            >
              <div className="px-4 py-3 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = state.activeItem === item.id;

                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => handleNavigation(item)}
                        className={`w-full px-4 py-3 rounded-xl font-poppins-medium text-left focus:outline-none transition-all duration-300 ${
                          isActive
                            ? 'nav-item-active text-white'
                            : 'text-white/90 hover:text-white hover:bg-red-600/20'
                        }`}
                        role="menuitem"
                        aria-label={item.ariaLabel}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon size={20} />
                          <span>{item.name}</span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
});

export default Navigation;
