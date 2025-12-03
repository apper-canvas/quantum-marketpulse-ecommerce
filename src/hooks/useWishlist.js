import { useState, useEffect } from 'react';
import { wishlistService } from '@/services/api/wishlistService';

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist items
  const loadWishlist = async () => {
    try {
      setLoading(true);
      const items = await wishlistService.getAll();
      setWishlistItems(items);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (productId) => {
    try {
      await wishlistService.add(productId);
      await loadWishlist();
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await wishlistService.remove(productId);
      await loadWishlist();
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  // Toggle item in wishlist
  const toggleWishlist = async (productId) => {
    try {
      await wishlistService.toggle(productId);
      await loadWishlist();
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistService.isInWishlist(productId);
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  // Load wishlist on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    loadWishlist
  };
};