import { toast } from 'react-toastify';

// Mock wishlist data storage
let wishlistItems = [];

// Simulate async operations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const wishlistService = {
  // Get all wishlist items
  getAll: async () => {
    await delay(200);
    return [...wishlistItems];
  },

  // Add item to wishlist
  add: async (productId) => {
    await delay(200);
    
    if (wishlistItems.find(item => item.productId === productId)) {
      throw new Error('Item already in wishlist');
    }

    const newItem = {
      Id: wishlistItems.length + 1,
      productId: productId,
      addedAt: new Date().toISOString()
    };
    
    wishlistItems.push(newItem);
    toast.success('Added to wishlist');
    return newItem;
  },

  // Remove item from wishlist
  remove: async (productId) => {
    await delay(200);
    
    const index = wishlistItems.findIndex(item => item.productId === productId);
    if (index === -1) {
      throw new Error('Item not found in wishlist');
    }
    
    wishlistItems.splice(index, 1);
    toast.success('Removed from wishlist');
    return true;
  },

  // Check if item is in wishlist
  isInWishlist: (productId) => {
    return wishlistItems.some(item => item.productId === productId);
  },

  // Toggle item in wishlist
  toggle: async (productId) => {
    if (wishlistService.isInWishlist(productId)) {
      return await wishlistService.remove(productId);
    } else {
      return await wishlistService.add(productId);
    }
  }
};

export default wishlistService;