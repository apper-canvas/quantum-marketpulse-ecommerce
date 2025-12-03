import { useState, useEffect } from "react";
import { cartService } from "@/services/api/cartService";
import { productService } from "@/services/api/productService";
import { toast } from "react-toastify";

export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const loadCart = async () => {
    try {
      setLoading(true);
      setError("");
      const cartData = await cartService.getCart();
      setCart(cartData);
      
      // Enrich cart data with product information
      if (cartData && cartData.length > 0) {
        const enrichedItems = await Promise.all(
          cartData.map(async (item) => {
            try {
              const product = await productService.getById(item.productId);
              return {
                ...item,
                product
              };
            } catch (err) {
              console.error(`Failed to load product ${item.productId}:`, err);
              // Return item without product data rather than null
              return {
                ...item,
                product: null
              };
            }
          })
        );
        // Filter out items where product loading failed and product is null
        const validItems = enrichedItems.filter(item => item.product !== null);
        setCartItems(validItems);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      setError("Failed to load cart");
      setCartItems([]); // Ensure cartItems is reset on error
      console.error("Cart loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartService.addToCart(productId, quantity);
      await loadCart();
      toast.success("Item added to cart!");
    } catch (err) {
      toast.error("Failed to add item to cart");
      console.error("Add to cart error:", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await cartService.updateCartItem(productId, quantity);
      await loadCart();
    } catch (err) {
      toast.error("Failed to update cart");
      console.error("Update cart error:", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartService.removeFromCart(productId);
      await loadCart();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
      console.error("Remove from cart error:", err);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart([]);
      setCartItems([]);
      toast.success("Cart cleared");
    } catch (err) {
      toast.error("Failed to clear cart");
      console.error("Clear cart error:", err);
    }
  };

const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    loadCart();
  }, []);

  return {
    cart,
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    refetch: loadCart
  };
};