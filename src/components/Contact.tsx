import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, MapPin, Clock, Mail, MessageCircle, ArrowUp } from "lucide-react";

const Contact = () => {
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle map link click
  const handleMapClick = () => {
    const address = encodeURIComponent("12, MC Rd, Ambur, Tamil Nadu, India");
    window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
  };

  // Handle phone call
  const handlePhoneCall = () => {
    window.open('tel:+919677938393', '_self');
  };

  // Handle WhatsApp
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hello! I would like to place an order at Ambur Fusion Delights.");
    window.open(`https://wa.me/919677938393?text=${message}`, '_blank');
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: ["+91 96779 38393", "Available for orders & queries"],
      action: "Call Now",
      onClick: handlePhoneCall
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      details: ["12, MC Rd, Ambur", "Tamil Nadu, India"],
      action: "Get Directions",
      onClick: handleMapClick
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Hours",
      details: ["Every day: 10:00 AM - 12:00 AM", "Open 365 days a year"],
      action: "View Schedule"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Features",
      details: ["Credit Cards Accepted", "Delivery • Takeaway • Booking"],
      action: "Learn More"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <Badge variant="secondary" className="mb-4 text-primary font-poppins">
            Get In Touch
          </Badge>
          <h2 className="text-4xl md:text-5xl font-poppins-bold text-foreground mb-4">
            Visit Us or Order Online
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-poppins">
            Ready to experience the authentic flavors of Ambur? Contact us for reservations,
            online orders, or any special requests. We're here to serve you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="fade-in-left">
            <h3 className="text-3xl font-poppins-bold text-foreground mb-8">
              Contact Information
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-none shadow-warm bg-card/50 backdrop-blur-sm scale-on-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        {info.icon}
                      </div>
                      <h4 className="font-poppins-medium text-foreground">{info.title}</h4>
                    </div>
                    <div className="space-y-1 mb-4">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-muted-foreground text-sm font-poppins">
                          {detail}
                        </p>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs font-poppins"
                      onClick={info.onClick}
                    >
                      {info.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="border-none shadow-warm bg-gradient-warm">
              <CardContent className="p-6">
                <h4 className="text-xl font-poppins-bold text-foreground mb-4">
                  Quick Actions
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="hero" 
                    className="glow-on-hover font-poppins-medium"
                    onClick={handlePhoneCall}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call to Order
                  </Button>
                  <Button 
                    variant="spice" 
                    className="glow-on-hover font-poppins-medium"
                    onClick={handleWhatsApp}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="fade-in-right">
            <Card className="border-none shadow-warm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-3xl font-poppins-bold text-foreground mb-6">
                  Send us a Message
                </h3>
                
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-poppins-medium text-foreground mb-2">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        className="bg-background/50 font-poppins"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-poppins-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        placeholder="Enter your phone"
                        className="bg-background/50 font-poppins"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-poppins-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="bg-background/50 font-poppins"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-poppins-medium text-foreground mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="What is this about?"
                      className="bg-background/50 font-poppins"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-poppins-medium text-foreground mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      className="bg-background/50 font-poppins"
                    />
                  </div>

                  <Button variant="hero" size="lg" className="w-full glow-on-hover font-poppins-medium">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Location Map Placeholder */}
        <div className="mt-16 fade-in-up">
          <Card className="border-none shadow-warm bg-gradient-warm">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-poppins-bold text-foreground mb-4">
                Find Us on the Map
              </h3>
              <div className="bg-muted/30 h-64 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground font-poppins mb-2">
                    12, MC Rd, Ambur, Tamil Nadu, India
                  </p>
                  <p className="text-sm text-muted-foreground font-poppins mb-4">
                    Wheelchair Accessible • Easy Parking Available
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4 font-poppins-medium"
                    onClick={handleMapClick}
                  >
                    Open in Google Maps
                  </Button>
                </div>
                {/* Optional: Add a subtle background pattern or gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Go to Top Button */}
        <div className="mt-12 text-center fade-in-up">
          <Button 
            onClick={scrollToTop}
            variant="outline"
            size="lg"
            className="group font-poppins-medium bg-primary/10 border-primary hover:bg-primary hover:text-white transition-all duration-300 px-8 py-3"
          >
            <ArrowUp className="w-5 h-5 mr-2 group-hover:animate-bounce" />
            Back to Top
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Contact;