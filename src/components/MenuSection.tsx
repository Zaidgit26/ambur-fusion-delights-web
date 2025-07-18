import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isVeg: boolean;
  isSpicy: boolean;
  isPopular: boolean;
}

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { state: cartState, addItem, openCart } = useCart();

  const categories = [
    { id: "all", name: "All Items", icon: "🍽️" },
    { id: "appetizers", name: "Appetizers", icon: "🥗" },
    { id: "biryani", name: "Biryani", icon: "🍛" },
    { id: "curries", name: "Curries", icon: "🍜" },
    { id: "desserts", name: "Desserts", icon: "🍰" },
    { id: "beverages", name: "Beverages", icon: "🥤" }
  ];

  const menuItems: MenuItem[] = [
    {
      id: "1",
      name: "Ambur Mutton Biryani",
      description: "Authentic Ambur-style biryani with tender mutton pieces, aromatic basmati rice, and traditional spices",
      price: 320,
      image: "/api/placeholder/300/200",
      category: "biryani",
      rating: 4.8,
      isVeg: false,
      isSpicy: true,
      isPopular: true
    },
    {
      id: "2", 
      name: "Chicken 65",
      description: "Crispy fried chicken pieces marinated in South Indian spices, served with mint chutney",
      price: 180,
      image: "/api/placeholder/300/200",
      category: "appetizers",
      rating: 4.6,
      isVeg: false,
      isSpicy: true,
      isPopular: true
    },
    {
      id: "3",
      name: "Vegetable Biryani",
      description: "Fragrant basmati rice cooked with mixed vegetables, saffron, and aromatic spices",
      price: 220,
      image: "/api/placeholder/300/200", 
      category: "biryani",
      rating: 4.4,
      isVeg: true,
      isSpicy: false,
      isPopular: false
    },
    {
      id: "4",
      name: "Butter Chicken",
      description: "Creamy tomato-based curry with tender chicken pieces, served with naan or rice",
      price: 280,
      image: "/api/placeholder/300/200",
      category: "curries",
      rating: 4.7,
      isVeg: false,
      isSpicy: false,
      isPopular: true
    },
    {
      id: "5",
      name: "Paneer Tikka",
      description: "Grilled cottage cheese cubes marinated in yogurt and spices, served with mint chutney",
      price: 200,
      image: "/api/placeholder/300/200",
      category: "appetizers", 
      rating: 4.3,
      isVeg: true,
      isSpicy: false,
      isPopular: false
    },
    {
      id: "6",
      name: "Gulab Jamun",
      description: "Traditional Indian sweet dumplings soaked in rose-flavored sugar syrup",
      price: 80,
      image: "/api/placeholder/300/200",
      category: "desserts",
      rating: 4.5,
      isVeg: true,
      isSpicy: false,
      isPopular: false
    },
    {
      id: "7",
      name: "Masala Chai",
      description: "Traditional Indian spiced tea brewed with cardamom, ginger, and aromatic spices",
      price: 40,
      image: "/api/placeholder/300/200",
      category: "beverages",
      rating: 4.2,
      isVeg: true,
      isSpicy: false,
      isPopular: false
    },
    {
      id: "8",
      name: "Fish Curry",
      description: "Fresh fish cooked in coconut-based curry with South Indian spices and curry leaves",
      price: 300,
      image: "/api/placeholder/300/200",
      category: "curries",
      rating: 4.6,
      isVeg: false,
      isSpicy: true,
      isPopular: false
    }
  ];

  const filteredItems = activeCategory === "all"
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      isVeg: item.isVeg,
      category: item.category,
    });
  };

  const getItemQuantity = (itemId: string) => {
    const cartItem = cartState.items.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <section id="menu" className="py-20 bg-gradient-to-br from-background via-background/95 to-muted/30 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <Badge variant="secondary" className="mb-4 text-primary font-poppins">
            Our Menu
          </Badge>
          <h2 className="font-spirax text-4xl md:text-5xl text-foreground mb-4">
            Authentic Flavors
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-poppins">
            Discover our carefully crafted dishes made with traditional recipes and the finest ingredients. 
            Each dish tells a story of authentic South Indian cuisine.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 fade-in-up px-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              size="sm"
              className={`font-poppins-medium transition-all duration-300 text-xs sm:text-sm ${
                activeCategory === category.id
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'hover:bg-primary/10 hover:border-primary/50'
              }`}
            >
              <span className="mr-1 sm:mr-2 text-sm">{category.icon}</span>
              <span className="hidden xs:inline sm:inline">{category.name}</span>
              <span className="xs:hidden sm:hidden">{category.name.split(' ')[0]}</span>
            </Button>
          ))}
        </div>

        {/* Menu Grid - Redesigned for compact mobile layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12">
          {filteredItems.map((item, index) => (
            <Card
              key={item.id}
              className="border-none shadow-warm bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden menu-card-hover"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-24 sm:h-32 md:h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />

                {/* Badges - Simplified for mobile */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {item.isPopular && (
                    <Badge className="bg-primary text-white font-poppins text-xs px-1 py-0.5">
                      Popular
                    </Badge>
                  )}
                  {item.isVeg && (
                    <Badge className="bg-secondary text-white font-poppins text-xs px-1 py-0.5">
                      Veg
                    </Badge>
                  )}
                  {item.isSpicy && (
                    <Badge className="bg-red-600 text-white font-poppins text-xs px-1 py-0.5">
                      🌶️
                    </Badge>
                  )}
                </div>

                {/* Rating - Hidden on mobile, visible on larger screens */}
                <div className="absolute top-2 right-2 bg-black/70 text-white px-1.5 py-0.5 rounded-full items-center gap-1 hidden sm:flex">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-poppins">{item.rating}</span>
                </div>
              </div>

              <CardContent className="p-2 sm:p-3 md:p-4">
                <h3 className="font-poppins-bold text-sm sm:text-base md:text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {item.name}
                </h3>

                {/* Description - Hidden on mobile for compact design */}
                <p className="text-muted-foreground text-xs mb-2 font-poppins leading-relaxed line-clamp-2 hidden sm:block">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="font-poppins-bold text-sm sm:text-lg md:text-xl text-primary">
                    ₹{item.price}
                  </span>

                  <div className="flex items-center gap-1">
                    {getItemQuantity(item.id) > 0 && (
                      <Badge variant="secondary" className="font-poppins text-xs px-1 py-0.5">
                        {getItemQuantity(item.id)}
                      </Badge>
                    )}
                    <Button
                      onClick={() => handleAddToCart(item)}
                      size="sm"
                      className="bg-primary hover:bg-primary/80 text-white font-poppins-medium transition-all duration-300 hover:scale-105 text-xs px-2 py-1 sm:px-3 sm:py-2 shadow-md hover:shadow-lg border border-primary/20 hover:border-primary/40"
                    >
                      <Plus className="w-3 h-3 mr-0.5 sm:mr-1" />
                      <span className="hidden sm:inline">Add</span>
                      <span className="sm:hidden">+</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart Summary & Order Button */}
        {cartState.totalItems > 0 && (
          <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 fade-in-up">
            <Button
              onClick={openCart}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-poppins-medium shadow-2xl hover:scale-105 transition-all duration-300 text-sm sm:text-base px-4 py-3 sm:px-6 sm:py-4"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden xs:inline">View Cart </span>
              <span className="xs:hidden">Cart </span>
              ({cartState.totalItems})
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
