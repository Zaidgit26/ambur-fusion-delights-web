import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Phone, MapPin, Mail, Clock, Star, Heart, ChefHat } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <ChefHat className="w-8 h-8 text-golden-rice" />
              <h3 className="text-2xl font-bold">Ambur Briyani</h3>
            </div>
            <p className="text-background/80 mb-6 leading-relaxed">
              Authentic South Indian flavors served with love since 1999. 
              Experience the legendary taste of traditional Ambur biryani.
            </p>
            <div className="flex items-center space-x-2 text-golden-rice">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <span className="text-background/80 ml-2">4.9/5 rated by customers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-3">
              <a href="#home" className="block text-background/80 hover:text-golden-rice transition-colors">
                Home
              </a>
              <a href="#menu" className="block text-background/80 hover:text-golden-rice transition-colors">
                Our Menu
              </a>
              <a href="#about" className="block text-background/80 hover:text-golden-rice transition-colors">
                About Us
              </a>
              <a href="#contact" className="block text-background/80 hover:text-golden-rice transition-colors">
                Contact
              </a>
              <a href="#" className="block text-background/80 hover:text-golden-rice transition-colors">
                Catering Services
              </a>
              <a href="#" className="block text-background/80 hover:text-golden-rice transition-colors">
                Special Events
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-golden-rice" />
                <span className="text-background/80">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-golden-rice" />
                <span className="text-background/80">orders@amburbriyani.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-golden-rice mt-1" />
                <span className="text-background/80">
                  123 Food Street,<br />
                  Ambur, Tamil Nadu 635802
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-golden-rice" />
                <span className="text-background/80">Daily: 11 AM - 11 PM</span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Order Now</h4>
            <p className="text-background/80 mb-4">
              Craving for authentic biryani? Place your order now and get it delivered fresh to your doorstep!
            </p>
            <div className="space-y-3">
              <Button 
                variant="default" 
                className="w-full bg-golden-rice text-foreground hover:bg-golden-rice/90"
              >
                Order Online
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-golden-rice text-golden-rice hover:bg-golden-rice/10"
              >
                Call to Order
              </Button>
            </div>
            <div className="mt-4 p-3 bg-background/10 rounded-lg">
              <p className="text-sm text-background/80">
                🚚 Free delivery on orders above ₹500
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-background/20" />

        {/* Bottom Footer */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-background/80 text-sm mb-4 md:mb-0">
            © 2024 Ambur Briyani. All rights reserved. 
            <span className="inline-flex items-center ml-2">
              Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> for food lovers
            </span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-background/80 hover:text-golden-rice transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-background/80 hover:text-golden-rice transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-background/80 hover:text-golden-rice transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;