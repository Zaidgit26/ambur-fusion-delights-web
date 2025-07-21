import { useState, memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useDevicePerformance, useOptimizedImage } from "@/hooks/usePerformanceOptimization";
import { useResponsiveBreakpoints } from "@/hooks/useResponsiveBreakpoints";
import { useReactOptimizations } from "@/hooks/useReactOptimizations";

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

// Performance-optimized menu item component with React optimizations
const MenuItemCard = memo(({ item, shouldReduceAnimations }: {
  item: MenuItem;
  shouldReduceAnimations: boolean;
}) => {
  const { src: optimizedImage, ref: imageRef } = useOptimizedImage(
    item.image,
    { lazy: true, quality: 'medium' }
  );

  // Performance optimization hooks
  const responsive = useResponsiveBreakpoints();
  const { memoizedStyles } = useReactOptimizations();



  // Memoized styles with proper typing
  const cardStyles = useMemo(() => ({
    ...memoizedStyles.gpuAccelerated,
    touchAction: 'manipulation' as const,
    WebkitTouchCallout: 'none' as const,
    WebkitUserSelect: 'none' as const,
    userSelect: 'none' as const,
    ...memoizedStyles.reducedMotion
  }), [memoizedStyles]);

  return (
    <Card
      className={`border-none shadow-warm bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group overflow-hidden menu-card-hover ${
        shouldReduceAnimations ? '' : 'hover:scale-[1.02]'
      }`}
      style={cardStyles}
    >
      <div className="relative overflow-hidden">
        <img
          ref={imageRef as React.RefObject<HTMLImageElement>}
          src={optimizedImage}
          alt={item.name}
          className={`w-full ${
            responsive.isMobile ? 'h-20' : 'h-24 sm:h-32 md:h-40'
          } object-cover transition-transform duration-300 ${
            shouldReduceAnimations ? '' : 'group-hover:scale-110'
          }`}
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

      <CardContent className={`${responsive.isMobile ? 'p-2' : 'p-2 sm:p-3 md:p-4'}`}>
        {/* Title - Mobile optimized sizing */}
        <h3 className={`font-poppins-bold ${
          responsive.isMobile ? 'text-xs' : 'text-sm sm:text-base md:text-lg'
        } text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2`}>
          {item.name}
        </h3>

        {/* Description - Hidden on mobile for compact design */}
        <p className="text-muted-foreground text-xs mb-2 font-poppins leading-relaxed line-clamp-2 hidden sm:block">
          {item.description}
        </p>

        {/* Price and Add Button - Mobile optimized layout */}
        <div className={`flex items-center ${responsive.isMobile ? 'justify-between' : 'justify-between'} gap-2`}>
          <span className={`font-poppins-bold ${
            responsive.isMobile ? 'text-sm' : 'text-sm sm:text-lg md:text-xl'
          } text-primary flex-shrink-0`}>
            ₹{item.price}
          </span>


        </div>
      </CardContent>
    </Card>
  );
});

const MenuSection = memo(() => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { shouldReduceAnimations } = useDevicePerformance();
  const responsive = useResponsiveBreakpoints();
  // Removed unused hooks to fix React Hook violations

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

  // Memoized filtered items to prevent unnecessary re-renders
  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return menuItems;
    return menuItems.filter(item => item.category === activeCategory);
  }, [activeCategory, menuItems]);



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

        {/* Menu Grid - Mobile-optimized spacing and layout */}
        <div className={`grid mb-12 ${
          responsive.isMobile
            ? 'grid-cols-2 gap-2'
            : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6'
        }`}>
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              shouldReduceAnimations={shouldReduceAnimations}
            />
          ))}
        </div>


      </div>
    </section>
  );
});

// Set display name for debugging
MenuSection.displayName = 'MenuSection';

export default MenuSection;
