import { motion } from "framer-motion";
import { Phone, MapPin, Clock, CreditCard, MessageCircle, Mail, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const DarkContactSection = () => {
  const phoneNumber = "919677938393";
  const phoneNumber2 = "918667287022";
  const whatsappMessage = "Hello! I would like to place an order at Original Ambur Briyani.";
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handlePhoneCall = () => {
    window.open('tel:+919677938393', '_self');
  };

  const handlePhoneCall2 = () => {
    window.open('tel:+918667287022', '_self');
  };

  const handleMapClick = () => {
    // Updated with the new Google Maps link
    window.open('https://maps.app.goo.gl/aNoYVgmRWQVsgYdE9?g_st=iwb', '_blank');
  };

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Call Us",
      detail: (
        <>
          <p className="text-white-muted font-poppins text-xs">+91 96779 38393</p>
          <p className="text-white-muted font-poppins text-xs">+91 86672 87022</p>
        </>
      ),
      action: handlePhoneCall
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Location",
      detail: "Ambur, Tamil Nadu",
      action: handleMapClick
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Open Hours",
      detail: "10:00 AM - 12:00 AM",
      action: null
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Payment",
      detail: "Cards, Cash, UPI",
      action: null
    }
  ];

  return (
    <section id="contact" className="relative py-20 bg-dark-light overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-light to-dark opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-5xl md:text-6xl text-white-off mb-4">
            Get In Touch
          </h2>
          <p className="text-white-muted font-poppins text-lg max-w-2xl mx-auto">
            Contact us for reservations, special orders, or any questions you may have
          </p>
        </motion.div>

        {/* Contact Info Cards - Horizontal Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              onClick={info.action}
              className={`
                bg-dark-card border border-dark-border rounded-2xl p-6
                backdrop-blur-md bg-opacity-50 transition-all duration-300
                hover:border-red-primary hover:shadow-lg hover:shadow-red-primary/20 hover:scale-105
                ${info.action ? 'cursor-pointer' : ''}
              `}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-red-primary/10 rounded-full mb-4 mx-auto">
                <div className="text-red-primary">
                  {info.icon}
                </div>
              </div>
              <h4 className="text-white-off font-poppins font-medium text-sm mb-2 text-center">
                {info.title}
              </h4>
              <div className="text-center">
                {typeof info.detail === 'string' ? (
                  <p className="text-white-muted font-poppins text-xs">{info.detail}</p>
                ) : (
                  info.detail
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Order and Send Message Cards - Same Height */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Order Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="bg-dark-card border border-dark-border rounded-2xl p-8 backdrop-blur-md bg-opacity-50 h-full transition-all duration-300 hover:border-red-primary hover:shadow-lg hover:shadow-red-primary/20">
              <h3 className="text-white-off font-playfair text-2xl mb-6">
                Quick Order
              </h3>
              <div className="space-y-4">
                <button 
                  onClick={handlePhoneCall}
                  className="w-full bg-red-primary hover:bg-red-dark text-white font-poppins font-medium py-4 px-6 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-red-primary/30"
                >
                  <Phone className="w-5 h-5" />
                  Call +91 96779 38393
                </button>
                <button 
                  onClick={handlePhoneCall2}
                  className="w-full bg-red-primary hover:bg-red-dark text-white font-poppins font-medium py-4 px-6 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-red-primary/30"
                >
                  <Phone className="w-5 h-5" />
                  Call +91 86672 87022
                </button>
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <button className="w-full bg-gradient-to-r from-green-whatsapp to-green-dark hover:from-green-dark hover:to-green-whatsapp text-white font-poppins font-medium py-4 px-6 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-green-whatsapp/30">
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Order
                  </button>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Send Message Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="bg-dark-card border border-dark-border rounded-2xl p-8 backdrop-blur-md bg-opacity-50 h-full transition-all duration-300 hover:border-red-primary hover:shadow-lg hover:shadow-red-primary/20">
              <h3 className="text-white-off font-playfair text-2xl mb-6">
                Send us a Message
              </h3>
              
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="group">
                    <Input
                      placeholder="Your Name"
                      className="bg-dark border-dark-border text-white-off placeholder:text-white-muted focus:border-red-primary/50 transition-all duration-300 rounded-lg py-3 font-poppins"
                    />
                  </div>
                  <div className="group">
                    <Input
                      placeholder="Phone Number"
                      className="bg-dark border-dark-border text-white-off placeholder:text-white-muted focus:border-red-primary/50 transition-all duration-300 rounded-lg py-3 font-poppins"
                    />
                  </div>
                </div>

                <div className="group">
                  <Input
                    type="email"
                    placeholder="Email Address"
                    className="bg-dark border-dark-border text-white-off placeholder:text-white-muted focus:border-red-primary/50 transition-all duration-300 rounded-lg py-3 font-poppins"
                  />
                </div>

                <div className="group">
                  <Textarea
                    placeholder="Your Message..."
                    rows={4}
                    className="bg-dark border-dark-border text-white-off placeholder:text-white-muted focus:border-red-primary/50 transition-all duration-300 rounded-lg py-3 font-poppins resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-primary to-red-dark hover:from-red-dark hover:to-red-primary text-white font-poppins font-medium py-4 px-6 rounded-full flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-primary/30 group"
                >
                  <span>Send Message</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 mb-20 md:mb-0"
        >
          <div className="bg-dark-card border border-dark-border rounded-2xl p-8 backdrop-blur-md bg-opacity-50 transition-all duration-300 hover:border-red-primary hover:shadow-lg hover:shadow-red-primary/20">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-red-primary mx-auto mb-4" />
              <h3 className="text-white-off font-playfair text-2xl mb-2">
                Visit Our Restaurant
              </h3>
              <p className="text-white-muted font-poppins mb-6">
                Ambur, Tamil Nadu, India
              </p>
              <button 
                onClick={handleMapClick}
                className="bg-red-primary hover:bg-red-dark text-white font-poppins font-medium py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-red-primary/30"
              >
                Get Directions
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fixed WhatsApp Button */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5, type: "spring" }}
        className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50"
      >
        <button className="bg-green-whatsapp hover:bg-green-dark text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:shadow-green-whatsapp/30 transition-all duration-300 hover:scale-110">
          <MessageCircle className="w-6 h-6" />
        </button>
      </motion.a>
    </section>
  );
};

export default DarkContactSection;
