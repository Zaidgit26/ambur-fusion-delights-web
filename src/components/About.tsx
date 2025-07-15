import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Clock, Users, Heart } from "lucide-react";

const About = () => {
  const stats = [
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      number: "25+",
      label: "Years of Excellence"
    },
    {
      icon: <Users className="w-8 h-8 text-accent" />,
      number: "50K+",
      label: "Happy Customers"
    },
    {
      icon: <Clock className="w-8 h-8 text-spice-warm" />,
      number: "24/7",
      label: "Service Available"
    },
    {
      icon: <Heart className="w-8 h-8 text-destructive" />,
      number: "100%",
      label: "Love in Every Dish"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <Badge variant="secondary" className="mb-4 text-primary">
            Our Story
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            A Legacy of Authentic Flavors
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Born from a passion for authentic South Indian cuisine, Ambur Briyani has been 
            serving the legendary flavors of Ambur to food lovers for over two decades.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Story Content */}
          <div className="fade-in-left">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              From Ambur Streets to Your Table
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Our journey began in the bustling streets of Ambur, Tamil Nadu, where our founder 
                learned the secret recipes passed down through generations of biryani masters. 
                The authentic Ambur style of cooking, with its unique blend of spices and traditional 
                dum cooking method, has been preserved and perfected over the years.
              </p>
              <p>
                What started as a small family business has grown into a beloved restaurant, 
                but our commitment remains the same - to serve you the most authentic, 
                flavorful biryani that captures the true essence of Ambur's culinary heritage.
              </p>
              <p>
                Every grain of rice, every piece of meat, and every spice is carefully selected 
                and prepared with the same love and attention that has made Ambur biryani famous 
                worldwide. We also expanded our menu to include delicious Chinese and tandoori 
                items to cater to diverse tastes while maintaining our quality standards.
              </p>
            </div>
          </div>

          {/* Image/Visual Element */}
          <div className="fade-in-right">
            <Card className="border-none shadow-warm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-hero rounded-full flex items-center justify-center">
                    <Award className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h4 className="text-2xl font-bold text-foreground mb-2">
                    Award-Winning Quality
                  </h4>
                  <p className="text-muted-foreground">
                    Recognized as the "Best Biryani Restaurant" by local food critics 
                    and consistently rated 4.8+ stars by our customers.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">Traditional recipes since 1999</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-foreground">Fresh ingredients daily</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-spice-warm rounded-full"></div>
                    <span className="text-foreground">Hygiene certified kitchen</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-golden-rice rounded-full"></div>
                    <span className="text-foreground">Expert chefs from Ambur</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 fade-in-up">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-none shadow-warm bg-card/50 backdrop-blur-sm scale-on-hover">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;