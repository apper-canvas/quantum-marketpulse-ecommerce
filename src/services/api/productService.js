import productsData from "@/services/mockData/products.json";

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const productService = {
  async getAll() {
    await delay();
    return [...productsData];
  },

  async getById(id) {
    await delay();
    const product = productsData.find(p => p.Id === parseInt(id));
    if (!product) throw new Error("Product not found");
    return { ...product };
  },

  async getByCategory(category) {
    await delay();
    if (!category || category === "All") {
      return [...productsData];
    }
    return productsData.filter(p => p.category === category);
  },

  async searchProducts(query) {
    await delay();
    if (!query) return [...productsData];
    
    const searchTerm = query.toLowerCase();
    return productsData.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  },

  async getFeaturedProducts(limit = 8) {
    await delay();
    return productsData
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
      .map(p => ({ ...p }));
  },

  async getRelatedProducts(productId, limit = 4) {
    await delay();
    const product = productsData.find(p => p.Id === parseInt(productId));
    if (!product) return [];
    
    return productsData
      .filter(p => p.Id !== parseInt(productId) && p.category === product.category)
      .slice(0, limit)
      .map(p => ({ ...p }));
  }
};