import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ChefHat, MapPin, Sparkles, Crown } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#menu", label: "Menu" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center mt-4">
      <header className={`w-[90%] max-w-5xl transition-all duration-500 rounded-[30px] ${
        isScrolled
          ? 'bg-background/98 backdrop-blur-xl border border-golden-rice/20 shadow-warm'
          : 'bg-gradient-to-r from-background/70 via-background/80 to-background/70 backdrop-blur-lg border border-golden-rice/10'
      }`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Enhanced Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="relative">
              <div className="bg-gradient-hero p-3 rounded-xl shadow-warm group-hover:shadow-glow transition-all duration-300">
                <Crown className="w-7 h-7 text-primary-foreground" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-golden-rice animate-pulse" />
            </div>
            <div>
              <h1 className="font-primary-bold text-2xl lg:text-3xl text-primary leading-tight">
                Original Ambur
              </h1>
              <p className="font-secondary text-sm text-golden-rice -mt-1 italic">Briyani</p>
            </div>
          </div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-primary px-6 py-3 rounded-xl text-base font-medium text-foreground hover:text-primary hover:bg-gradient-warm transition-all duration-300 relative group shadow-sm hover:shadow-warm"
              >
                {item.label}
                <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-gradient-hero rounded-full transition-all duration-300 group-hover:w-3/4 group-hover:left-1/8"></span>
              </a>
            ))}
          </nav>

          {/* Enhanced Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-gradient-warm backdrop-blur-sm px-4 py-2 rounded-full border border-golden-rice/20 shadow-sm">
              <Phone className="w-4 h-4 text-primary animate-pulse" />
              <span className="font-primary font-medium">+91 98765 43210</span>
            </div>
            <Button
              variant="hero"
              size="sm"
              className="font-primary-bold shadow-warm hover:shadow-glow scale-on-hover bg-gradient-hero px-6 py-2.5"
            >
              Order Now
            </Button>
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-foreground hover:text-primary hover:bg-gradient-warm transition-all duration-300 rounded-xl p-3"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div className={`md:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen
            ? 'max-h-96 opacity-100 pb-6'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-card/98 backdrop-blur-xl border border-golden-rice/20 rounded-2xl mt-4 shadow-warm overflow-hidden">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-primary block px-6 py-4 rounded-xl text-lg font-medium text-foreground hover:text-primary hover:bg-gradient-warm transition-all duration-300 transform hover:translate-x-2 shadow-sm hover:shadow-warm"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.label}
                </a>
              ))}

              <div className="border-t border-golden-rice/20 mt-4 pt-4 px-2 space-y-4">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground bg-gradient-warm rounded-lg px-3 py-2">
                  <Phone className="w-5 h-5 text-primary animate-pulse" />
                  <span className="font-primary font-medium">+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground bg-gradient-warm rounded-lg px-3 py-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-primary font-medium">Ambur, Tamil Nadu</span>
                </div>
                <Button
                  variant="hero"
                  size="sm"
                  className="font-primary-bold w-full shadow-warm hover:shadow-glow bg-gradient-hero py-3 text-lg"
                >
                  Order Now
                </Button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;