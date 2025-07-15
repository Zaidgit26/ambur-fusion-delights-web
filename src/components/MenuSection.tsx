import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Flame, Leaf } from "lucide-react";

const MenuSection = () => {
  const biryaniItems = [
    {
      name: "Ambur Chicken Briyani",
      description: "Our signature dish with tender chicken and aromatic basmati rice",
      price: "₹299",
      rating: 4.9,
      isSignature: true,
      spiceLevel: 2
    },
    {
      name: "Ambur Mutton Briyani",
      description: "Premium mutton cooked with traditional spices and saffron",
      price: "₹399",
      rating: 4.8,
      isSignature: true,
      spiceLevel: 3
    },
    {
      name: "Egg Briyani",
      description: "Flavorful biryani with perfectly boiled eggs and aromatic rice",
      price: "₹249",
      rating: 4.7,
      spiceLevel: 2
    },
    {
      name: "Vegetable Briyani",
      description: "Mixed vegetables and paneer with fragrant basmati rice",
      price: "₹199",
      rating: 4.6,
      isVeg: true,
      spiceLevel: 1
    }
  ];

  const chineseItems = [
    {
      name: "Chicken Hakka Noodles",
      description: "Stir-fried noodles with chicken and fresh vegetables",
      price: "₹179",
      rating: 4.5,
      spiceLevel: 2
    },
    {
      name: "Chicken Fried Rice",
      description: "Wok-fried rice with chicken, eggs, and seasonal vegetables",
      price: "₹169",
      rating: 4.4,
      spiceLevel: 1
    },
    {
      name: "Chilli Chicken",
      description: "Crispy chicken tossed in spicy Indo-Chinese sauce",
      price: "₹229",
      rating: 4.6,
      spiceLevel: 3
    },
    {
      name: "Tandoori Chicken",
      description: "Clay oven roasted chicken marinated in yogurt and spices",
      price: "₹249",
      rating: 4.7,
      spiceLevel: 2
    },
    {
      name: "Veg Hakka Noodles",
      description: "Stir-fried noodles with mixed vegetables and sauces",
      price: "₹149",
      rating: 4.3,
      isVeg: true,
      spiceLevel: 1
    },
    {
      name: "Paneer Manchurian",
      description: "Cottage cheese balls in tangy Indo-Chinese gravy",
      price: "₹199",
      rating: 4.5,
      isVeg: true,
      spiceLevel: 2
    }
  ];

  const renderSpiceLevel = (level: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(3)].map((_, i) => (
          <Flame 
            key={i} 
            className={`w-3 h-3 ${i < level ? 'text-spice-hot' : 'text-muted-foreground/30'}`}
          />
        ))}
      </div>
    );
  };

  const MenuCard = ({ item, index }: { item: any; index: number }) => (
    <Card className={`group hover:shadow-warm transition-all duration-300 scale-on-hover ${index % 2 === 0 ? 'fade-in-left' : 'fade-in-right'}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              {item.isSignature && (
                <Badge variant="default" className="bg-gradient-spice text-xs">
                  Signature
                </Badge>
              )}
              {item.isVeg && (
                <div className="flex items-center">
                  <Leaf className="w-4 h-4 text-green-600" />
                </div>
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-3">
              {item.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-golden-rice fill-current" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>
                {renderSpiceLevel(item.spiceLevel)}
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">{item.price}</p>
              </div>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <Badge variant="secondary" className="mb-4 text-primary">
            Our Menu
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Delicious Offerings
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From our world-famous Ambur biryani to delicious Chinese specialties, 
            every dish is prepared with authentic flavors and the finest ingredients.
          </p>
        </div>

        {/* Biryani Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            Signature Briyani Collection
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {biryaniItems.map((item, index) => (
              <MenuCard key={item.name} item={item} index={index} />
            ))}
          </div>
        </div>

        {/* Chinese Section */}
        <div>
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            Chinese & Tandoori Specialties
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chineseItems.map((item, index) => (
              <MenuCard key={item.name} item={item} index={index} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 fade-in-up">
          <div className="bg-gradient-warm p-8 rounded-2xl shadow-warm">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Can't decide? Try our combo meals!
            </h3>
            <p className="text-muted-foreground mb-6">
              Get the best of both worlds with our specially curated combo deals
            </p>
            <Button variant="hero" size="lg" className="glow-on-hover">
              View Combo Deals
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;