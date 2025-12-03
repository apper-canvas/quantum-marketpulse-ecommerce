import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { useCart } from "@/hooks/useCart";

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, loading, error, getCartTotal, clearCart } = useCart();

  const cartTotal = getCartTotal();
  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    onClose();
    navigate("/");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold font-display text-secondary">
                Shopping Cart
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
<div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-6">
                  <Loading message="Loading cart..." />
                </div>
              ) : error ? (
                <div className="p-6">
                  <div className="text-red-500 text-center">
                    <p>{error}</p>
                  </div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="h-full flex items-center justify-center p-6">
                  <Empty
                    icon="ShoppingCart"
                    title="Your cart is empty"
                    message="Add some products to get started"
                    actionLabel="Start Shopping"
                    onAction={handleContinueShopping}
                  />
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {cartItems.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}

                  {/* Clear Cart */}
                  <div className="pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCart}
                      className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                      Clear Cart
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-200 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium font-body text-secondary">
                    Total:
                  </span>
                  <span className="text-2xl font-bold font-display gradient-text">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={handleCheckout}
                    className="w-full"
                    size="lg"
                  >
                    <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={handleContinueShopping}
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;