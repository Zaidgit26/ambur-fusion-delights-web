import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, MapPin, Clock, Mail, MessageCircle } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: ["+91 98765 43210", "+91 87654 32109"],
      action: "Call Now"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      details: ["123 Food Street, Ambur", "Tamil Nadu 635802"],
      action: "Get Directions"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Hours",
      details: ["Mon-Sun: 11:00 AM - 11:00 PM", "Special hours on festivals"],
      action: "View Schedule"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["orders@amburbriyani.com", "info@amburbriyani.com"],
      action: "Send Email"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <Badge variant="secondary" className="mb-4 text-primary">
            Get In Touch
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Visit Us or Order Online
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to experience the authentic flavors of Ambur? Contact us for reservations, 
            online orders, or any special requests. We're here to serve you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="fade-in-left">
            <h3 className="text-3xl font-bold text-foreground mb-8">
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
                      <h4 className="font-semibold text-foreground">{info.title}</h4>
                    </div>
                    <div className="space-y-1 mb-4">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-muted-foreground text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      {info.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="border-none shadow-warm bg-gradient-warm">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-foreground mb-4">
                  Quick Actions
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="hero" className="glow-on-hover">
                    <Phone className="w-4 h-4 mr-2" />
                    Call to Order
                  </Button>
                  <Button variant="spice" className="glow-on-hover">
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
                <h3 className="text-3xl font-bold text-foreground mb-6">
                  Send us a Message
                </h3>
                
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Your Name
                      </label>
                      <Input 
                        id="name" 
                        placeholder="Enter your name" 
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input 
                        id="phone" 
                        placeholder="Enter your phone" 
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      className="bg-background/50"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Subject
                    </label>
                    <Input 
                      id="subject" 
                      placeholder="What is this about?" 
                      className="bg-background/50"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us how we can help you..." 
                      rows={5}
                      className="bg-background/50"
                    />
                  </div>

                  <Button variant="hero" size="lg" className="w-full glow-on-hover">
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
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Find Us on the Map
              </h3>
              <div className="bg-muted/30 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Interactive map integration coming soon
                  </p>
                  <Button variant="outline" className="mt-4">
                    Get Directions via Google Maps
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;