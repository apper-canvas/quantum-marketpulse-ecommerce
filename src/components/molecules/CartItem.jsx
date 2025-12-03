import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { useCart } from "@/hooks/useCart";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(item.productId, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };

  const itemTotal = item.product.price * item.quantity;

  return (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-100">
      {/* Product Image */}
      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 space-y-2">
        <h4 className="font-medium font-body text-secondary line-clamp-2">
          {item.product.name}
        </h4>
        
        <div className="text-sm text-gray-500">
          ${item.product.price} each
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-1 hover:bg-gray-100 transition-colors"
              disabled={item.quantity <= 1}
            >
              <ApperIcon name="Minus" className="w-4 h-4" />
            </button>
            
            <span className="px-3 py-1 text-sm font-medium">
              {item.quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-1 hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Item Total */}
      <div className="text-right">
        <div className="font-bold font-display text-lg gradient-text">
          ${itemTotal.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default CartItem;