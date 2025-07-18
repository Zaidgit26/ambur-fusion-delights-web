import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart, formatPrice } from '@/contexts/CartContext';

const CartDropdown: React.FC = () => {
  const { state, closeCart, updateQuantity, removeItem, clearCart } = useCart();

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: -20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: { 
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.2 }
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    console.log('Proceeding to checkout with items:', state.items);
    closeCart();
  };

  if (!state.isOpen) return null;

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Cart Dropdown */}
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-20 right-4 sm:right-6 lg:right-8 w-80 sm:w-96 max-h-[80vh] z-50"
          >
            {/* Glassmorphism Container */}
            <div className="bg-black/40 backdrop-blur-20 border border-primary/20 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    <h3 className="font-poppins-bold text-lg text-white">Your Cart</h3>
                    {state.totalItems > 0 && (
                      <Badge className="bg-primary text-white font-poppins text-xs">
                        {state.totalItems} {state.totalItems === 1 ? 'item' : 'items'}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeCart}
                    className="text-white/80 hover:text-white hover:bg-white/10 p-1"
                  >
                    <X size={20} />
                  </Button>
                </div>
              </div>

              {/* Cart Content */}
              <div className="max-h-96 overflow-y-auto cart-scrollbar">
                {state.items.length === 0 ? (
                  /* Empty Cart */
                  <div className="p-8 text-center">
                    <ShoppingBag className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/70 font-poppins mb-2">Your cart is empty</p>
                    <p className="text-white/50 font-poppins text-sm">Add some delicious items to get started!</p>
                  </div>
                ) : (
                  /* Cart Items */
                  <div className="p-4 space-y-3">
                    <AnimatePresence>
                      {state.items.map((item) => (
                        <motion.div
                          key={item.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10"
                        >
                          <div className="flex items-center space-x-3">
                            {/* Item Image */}
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Item Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-poppins-medium text-white text-sm truncate">
                                    {item.name}
                                  </h4>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="font-poppins-bold text-primary text-sm">
                                      {formatPrice(item.price)}
                                    </span>
                                    {item.isVeg && (
                                      <Badge className="bg-secondary text-white text-xs px-1 py-0">
                                        Veg
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {/* Remove Button */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                  className="text-white/60 hover:text-red-400 hover:bg-red-500/10 p-1 ml-2"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    className="text-white/80 hover:text-white hover:bg-primary/20 w-8 h-8 p-0"
                                  >
                                    <Minus size={14} />
                                  </Button>
                                  <span className="font-poppins-medium text-white text-sm w-8 text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    className="text-white/80 hover:text-white hover:bg-primary/20 w-8 h-8 p-0"
                                  >
                                    <Plus size={14} />
                                  </Button>
                                </div>

                                {/* Item Total */}
                                <span className="font-poppins-bold text-white text-sm">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              {state.items.length > 0 && (
                <div className="p-4 border-t border-white/10 bg-black/20">
                  {/* Total */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-poppins-medium text-white">Total:</span>
                    <span className="font-poppins-bold text-xl text-primary">
                      {formatPrice(state.totalPrice)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-poppins-medium py-3"
                    >
                      Proceed to Checkout
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={clearCart}
                      className="w-full text-white/70 hover:text-white hover:bg-white/10 font-poppins text-sm"
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDropdown;
