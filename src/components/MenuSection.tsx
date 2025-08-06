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
            shouldReduceAnimations ? '' : 'group-hover:scale-105'
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
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-full items-center gap-1 hidden sm:flex">
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

  const categories = [
    { id: "all", name: "All", icon: "🍽️" },
    { id: "biryani", name: "Briyani", icon: "🍛" },

    { id: "chinese", name: "Chinese", icon: "🥡" },
    { id: "bbq", name: "BBQ", icon: "🍖" },
    { id: "curries", name: "Curries", icon: "🥘" },
    { id: "breads", name: "Breads", icon: "🥖" },
  ];

  const menuItems: MenuItem[] = [
    {
      id: "1",
      name: "Mutton Biryani",
      description: "Signature Ambur-style biryani with succulent mutton.",
      price: 280,
      image: "/src/assets/Menu Assets/Mutton Biryani.webp",
      category: "biryani",
      rating: 4.8,
      isVeg: false,
      isSpicy: true,
      isPopular: true
    },
    {
      id: "2",
      name: "Chicken Biryani",
      description: "Signature Ambur-style biryani with succulent Chicken.",
      price: 170,
      image: "/src/assets/Menu Assets/Mutton Biryani.webp",
      category: "biryani",
      rating: 4.8,
      isVeg: false,
      isSpicy: true,
      isPopular: true
    },
    {
      id: "3",
      name: "Boneless Chicken 65",
      description: "Spicy, deep-fried chicken bites, a classic appetizer.",
      price: 100,
      image: "/src/assets/Menu Assets/Chicken 65.webp",
      category: "appetizers",
      rating: 4.6,
      isVeg: false,
      isSpicy: true,
      isPopular: true
    },
    {
      id: "4",
      name: "Chicken Lollipop",
      description: "Frenched chicken winglets, a fun and tasty starter.",
      price: 160,
      image: "/src/assets/Menu Assets/Chicken Lollipop.webp",
      category: "appetizers",
      rating: 4.4,
      isVeg: false,
      isSpicy: true,
      isPopular: false
    },
    {
      id: "5",
      name: "Gobi Manchurian",
      description: "Crispy cauliflower florets in a tangy Manchurian sauce.",
      price: 120,
      image: "/src/assets/Menu Assets/Gobi Manchurian.webp",
      category: "chinese",
      rating: 4.7,
      isVeg: true,
      isSpicy: true,
      isPopular: true
    },
    {
      id: "6",
      name: "Chicken Fried Rice",
      description: "Wok-tossed fried rice with chicken and vegetables.",
      price: 100,
      image: "/src/assets/Menu Assets/Chicken Fried Rice.webp",
      category: "chinese",
      rating: 4.5,
      isVeg: false,
      isSpicy: false,
      isPopular: false
    },
    {
      id: "7",
      name: "Chicken BBQ",
      description: "Tender chicken grilled with a smoky barbecue flavor.",
      price: 420,
      image: "/src/assets/Menu Assets/Chicken BBQ.webp",
      category: "bbq",
      rating: 4.7,
      isVeg: false,
      isSpicy: false,
      isPopular: true
    },
    {
      id: "8",
      name: "Tandoori Chicken",
      description: "Chicken marinated in yogurt and spices, cooked in a tandoor.",
      price: 420,
      image: "/src/assets/Menu Assets/Tandoori.webp",
      category: "bbq",
      rating: 4.8,
      isVeg: false,
      isSpicy: true,
      isPopular: true
    },
    {
      id: "9",
      name: "Butter Chicken Gravy",
      description: "Creamy and rich butter chicken curry.",
      price: 190,
      image: "/src/assets/Menu Assets/Butter Chicken Gravy.webp",
      category: "curries",
      rating: 4.9,
      isVeg: false,
      isSpicy: false,
      isPopular: true
    },
    {
      id: "10",
      name: "Mutton Chukka",
      description: "Dry mutton curry with a blend of aromatic spices.",
      price: 220,
      image: "/src/assets/Menu Assets/Mutton Chukka.webp",
      category: "curries",
      rating: 4.7,
      isVeg: false,
      isSpicy: true,
      isPopular: false
    },
    {
      id: "11",
      name: "Fish Fry",
      description: "Crispy and spicy fried fish, a coastal delicacy.",
      price: 180,
      image: "/src/assets/Menu Assets/Fish Fry.webp",
      category: "appetizers",
      rating: 4.6,
      isVeg: false,
      isSpicy: true,
      isPopular: false
    },
    {
      id: "12",
      name: "Parotta",
      description: "Layered flatbread, perfect with any curry.",
      price: 50,
      image: "/src/assets/Menu Assets/Parotta.webp",
      category: "breads",
      rating: 4.5,
      isVeg: true,
      isSpicy: false,
      isPopular: true
    },
    {
        id: "13",
        name: "Chicken Gravy",
        description: "A rich and savory chicken curry, perfect with rice or bread.",
        price: 260,
        image: "/src/assets/Menu Assets/Chicken Gravy.webp",
        category: "curries",
        rating: 4.6,
        isVeg: false,
        isSpicy: true,
        isPopular: false
    },
    {
        id: "14",
        name: "Veg Fried Rice",
        description: "A classic stir-fry of rice and mixed vegetables.",
        price: 200,
        image: "/src/assets/Menu Assets/Veg Fried Rice.webp",
        category: "chinese",
        rating: 4.2,
        isVeg: true,
        isSpicy: false,
        isPopular: false
    }
  ];

  // Memoized filtered items to prevent unnecessary re-renders
  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return menuItems;
    return menuItems.filter(item => item.category === activeCategory);
  }, [activeCategory, menuItems]);

  // Category display logic - mobile vs desktop



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
          <h2 className="font-poppins text-4xl md:text-5xl text-foreground mb-4">
            OUR MENU
          </h2>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 fade-in-up px-2">
          {/* Always visible categories */}
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              size="sm"
              className={`font-poppins-medium transition-all duration-300 text-xs sm:text-sm ${
                activeCategory === category.id
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'hover:bg-primary/10 hover:border-primary/50 hover:text-primary'
              }`}
            >
              <span className="mr-1 sm:mr-2 text-sm">{category.icon}</span>
              <span className="hidden xs:inline sm:inline">{category.name}</span>
              <span className="xs:hidden sm:hidden">{category.name.split(' ')[0]}</span>
            </Button>
          ))}
        </div>

        {/* Menu Grid - Mobile-optimized spacing and layout */}
        <div className={`grid mb-6 ${
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
