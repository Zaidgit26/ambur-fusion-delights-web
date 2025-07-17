import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, Flame } from "lucide-react";

const FeaturedDish = () => {
  return (
    <section className="py-20 bg-gradient-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <Badge variant="secondary" className="mb-4 text-primary">
            Our Signature Dish
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            The Original Ambur Briyani
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A culinary masterpiece passed down through generations, featuring perfectly spiced basmati rice, 
            tender meat, and aromatic saffron that creates an unforgettable dining experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="fade-in-left">
            <div className="relative">
              <img 
                src="/lovable-uploads/bc217bd4-1f1a-4f3e-bb46-8db03ee0c5e5.png"
                alt="Authentic Ambur Biryani"
                className="w-full h-96 object-cover rounded-2xl shadow-warm scale-on-hover"
              />
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold">
                ₹299
              </div>
              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm p-2 rounded-full">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-golden-rice fill-current" />
                  <span className="text-sm font-medium">4.9</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="fade-in-right">
            <Card className="border-none shadow-warm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-foreground mb-6">
                  What Makes It Special?
                </h3>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Flame className="w-6 h-6 text-spice-warm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Authentic Spice Blend</h4>
                      <p className="text-muted-foreground">
                        Secret family recipe with 15+ aromatic spices, including premium saffron and star anise
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Slow Cooked Perfection</h4>
                      <p className="text-muted-foreground">
                        Traditional dum cooking method for 2+ hours to achieve the perfect texture and flavor
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Generous Portions</h4>
                      <p className="text-muted-foreground">
                        Hearty servings with tender meat, perfectly spiced rice, and traditional accompaniments
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button variant="hero" size="lg" className="w-full glow-on-hover">
                    Order Ambur Briyani - ₹299
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    Add to Favorites
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDish;