const CART_STORAGE_KEY = "marketpulse_cart";

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));

export const cartService = {
  async getCart() {
    await delay();
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  },

  async addToCart(productId, quantity = 1) {
    await delay();
    const cart = await this.getCart();
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId,
        quantity,
        addedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return cart;
  },

  async updateCartItem(productId, quantity) {
    await delay();
    const cart = await this.getCart();
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
    }
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return cart;
  },

  async removeFromCart(productId) {
    await delay();
    const cart = await this.getCart();
    const updatedCart = cart.filter(item => item.productId !== productId);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    return updatedCart;
  },

  async clearCart() {
    await delay();
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  },

  async getCartCount() {
    const cart = await this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
};