import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Star, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isVeg: boolean;
  isSpicy: boolean;
  isPopular: boolean;
}

// Dark themed menu card with WhatsApp integration
const MenuCard = memo(({ item }: { item: MenuItem }) => {
  const phoneNumber = "919677938393"; // Restaurant WhatsApp number
  const whatsappMessage = `Hi! I'm interested in ordering ${item.name} from your menu.`;
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className="group"
    >
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden backdrop-blur-md bg-opacity-50 shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Image Container */}
        <div className="relative h-36 sm:h-48 md:h-56 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            {item.isPopular && (
              <Badge className="bg-red-primary text-white border-0 px-1.5 py-0.5 text-xs font-poppins">
                Popular
              </Badge>
            )}
            {item.isVeg && (
              <Badge className="bg-green-dark text-white border-0 px-1.5 py-0.5 text-xs font-poppins">
                Veg
              </Badge>
            )}
            {item.isSpicy && (
              <Badge className="bg-orange-600 text-white border-0 px-1.5 py-0.5 text-xs font-poppins">
                🌶️ Spicy
              </Badge>
            )}
          </div>

          {/* Rating */}
          <div className="absolute top-2 right-2 bg-dark backdrop-blur-md bg-opacity-80 px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-white-off text-xs font-poppins">{item.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 md:p-5">
          <h3 className="text-white-off font-poppins font-semibold text-sm md:text-lg mb-2 md:mb-3 line-clamp-1">
            {item.name}
          </h3>
          
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <span className="text-red-primary font-playfair text-lg md:text-2xl font-bold">
              ₹{item.price}
            </span>
          </div>

          {/* WhatsApp Order Button */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <button className="w-full bg-gradient-to-r from-green-whatsapp to-green-dark hover:from-green-dark hover:to-green-whatsapp text-white font-poppins font-medium py-2 md:py-3 px-2 md:px-4 rounded-full flex items-center justify-center gap-1 md:gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-whatsapp/30">
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm">Order on WhatsApp</span>
            </button>
          </a>
        </div>
      </div>
    </motion.div>
  );
});

MenuCard.displayName = 'MenuCard';

const DarkMenuSection = memo(() => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = [
    { id: "all", name: "All", emoji: "🍽️" },
    { id: "biryani", name: "Biryani", emoji: "🍛" },
    { id: "appetizers", name: "Starters", emoji: "🥘" },
    { id: "chinese", name: "Chinese", emoji: "🥡" },
    { id: "bbq", name: "BBQ", emoji: "🍖" },
    { id: "curries", name: "Curries", emoji: "🥘" },
    { id: "breads", name: "Breads", emoji: "🥖" },
  ];

  // Split categories for mobile view
  const primaryCategories = categories.slice(0, 3); // First 3 categories
  const secondaryCategories = categories.slice(3); // Rest of categories

  const menuItems: MenuItem[] = [
    {
      id: "1",
      name: "Mutton Biryani",
      price: 280,
      image: "/assets/Menu Assets/Mutton Biryani.webp",
      category: "biryani",
      rating: 4.8,
      isVeg: false,
      isSpicy: true,
      isPopular: true
    },
    {
      id: "2",
      name: "Chicken Biryani",
      price: 170,
      image: "/assets/Menu Assets/Mutton Biryani.webp",
      category: "biryani",
      rating: 4.8,
      isVeg: false,
      isSpicy: true,
      isPopular: true
    },
    {
      id: "3",
      name: "Boneless Chicken 65",
      price: 100,
      image: "/assets/Menu Assets/Chicken 65.webp",
      category: "appetizers",
      rating: 4.6,
      isVeg: false,
      isSpicy: true,
      isPopular: true
    },
    {
      id: "4",
      name: "Chicken Lollipop",
      price: 160,
      image: "/assets/Menu Assets/Chicken Lollipop.webp",
      category: "appetizers",
      rating: 4.4,
      isVeg: false,
      isSpicy: true,
      isPopular: false
    },
    {
      id: "5",
      name: "Gobi Manchurian",
      price: 120,
      image: "/assets/Menu Assets/Gobi Manchurian.webp",
      category: "chinese",
      rating: 4.7,
      isVeg: true,
      isSpicy: true,
      isPopular: true
    },
    {
      id: "6",
      name: "Chicken Fried Rice",
      price: 100,
      image: "/assets/Menu Assets/Chicken Fried Rice.webp",
      category: "chinese",
      rating: 4.5,
      isVeg: false,
      isSpicy: false,
      isPopular: false
    },
    {
      id: "7",
      name: "Chicken BBQ",
      price: 420,
      image: "/assets/Menu Assets/Chicken BBQ.webp",
      category: "bbq",
      rating: 4.7,
      isVeg: false,
      isSpicy: false,
      isPopular: true
    },
    {
      id: "8",
      name: "Tandoori Chicken",
      price: 420,
      image: "/assets/Menu Assets/Tandoori.webp",
      category: "bbq",
      rating: 4.8,
      isVeg: false,
      isSpicy: true,
      isPopular: true
    },
    {
      id: "9",
      name: "Butter Chicken Gravy",
      price: 190,
      image: "/assets/Menu Assets/Butter Chicken Gravy.webp",
      category: "curries",
      rating: 4.9,
      isVeg: false,
      isSpicy: false,
      isPopular: true
    },
    {
      id: "10",
      name: "Mutton Chukka",
      price: 220,
      image: "/assets/Menu Assets/Mutton Chukka.webp",
      category: "curries",
      rating: 4.7,
      isVeg: false,
      isSpicy: true,
      isPopular: false
    },
    {
      id: "11",
      name: "Fish Fry",
      price: 180,
      image: "/assets/Menu Assets/Fish Fry.webp",
      category: "appetizers",
      rating: 4.6,
      isVeg: false,
      isSpicy: true,
      isPopular: false
    },
    {
      id: "12",
      name: "Parotta",
      price: 50,
      image: "/assets/Menu Assets/Parotta.webp",
      category: "breads",
      rating: 4.5,
      isVeg: true,
      isSpicy: false,
      isPopular: true
    },
    {
      id: "13",
      name: "Chicken Gravy",
      price: 260,
      image: "/assets/Menu Assets/Chicken Gravy.webp",
      category: "curries",
      rating: 4.6,
      isVeg: false,
      isSpicy: true,
      isPopular: false
    },
    {
      id: "14",
      name: "Veg Fried Rice",
      price: 200,
      image: "/assets/Menu Assets/Veg Fried Rice.webp",
      category: "chinese",
      rating: 4.2,
      isVeg: true,
      isSpicy: false,
      isPopular: false
    }
  ];

  const filteredItems = activeCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="relative min-h-screen py-20 bg-dark overflow-hidden flex flex-col">
      {/* Subtle noise texture background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-5xl md:text-6xl text-white-off mb-4">
            Our Menu
          </h2>
          <p className="text-white-muted font-poppins text-lg max-w-2xl mx-auto">
            Authentic Ambur Biryani and delicious Indian cuisine, delivered fresh to your doorstep
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          {/* Desktop View - All categories */}
          <div className="hidden md:flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  px-6 py-3 rounded-full font-poppins font-medium text-sm transition-all duration-300
                  ${activeCategory === category.id 
                    ? 'bg-red-primary text-white shadow-lg shadow-red-primary/30 scale-105' 
                    : 'bg-dark-card border border-dark-border text-white-muted hover:text-white-off hover:border-red-primary/50'
                  }
                `}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Mobile View - First 3 categories + dropdown */}
          <div className="md:hidden">
            <div className="flex justify-center gap-3 mb-4">
              {primaryCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    px-4 py-2 rounded-full font-poppins font-medium text-xs transition-all duration-300
                    ${activeCategory === category.id 
                      ? 'bg-red-primary text-white shadow-lg shadow-red-primary/30 scale-105' 
                      : 'bg-dark-card border border-dark-border text-white-muted hover:text-white-off hover:border-red-primary/50'
                    }
                  `}
                >
                  <span className="mr-2">{category.emoji}</span>
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* Dropdown for additional categories */}
            <div className="flex justify-center">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center px-4 py-2 bg-dark-card border border-dark-border rounded-full text-white-muted hover:text-white-off transition-colors font-poppins text-xs"
                >
                  <span className="mr-2">More Categories</span>
                  <ChevronDown size={16} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-48 bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden z-10"
                    >
                      <div className="p-2">
                        {secondaryCategories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              setActiveCategory(category.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`
                              w-full px-4 py-3 rounded-xl font-poppins font-medium text-sm text-left transition-all duration-300 flex items-center
                              ${activeCategory === category.id 
                                ? 'bg-red-primary text-white' 
                                : 'text-white-muted hover:text-white-off hover:bg-dark-border/50'
                              }
                            `}
                          >
                            <span className="mr-3">{category.emoji}</span>
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <MenuCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
});

DarkMenuSection.displayName = 'DarkMenuSection';

export default DarkMenuSection;
