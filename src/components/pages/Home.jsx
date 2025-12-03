import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "@/components/organisms/ProductGrid";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
import { motion } from "framer-motion";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categories = ["All", "Electronics", "Fashion", "Home", "Sports"];

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      let result;
      const urlSearch = searchParams.get("search");
      const urlCategory = searchParams.get("category");

      // Set state from URL params
      if (urlSearch && urlSearch !== searchQuery) {
        setSearchQuery(urlSearch);
      }
      if (urlCategory && urlCategory !== selectedCategory) {
        setSelectedCategory(urlCategory);
      }

      if (urlSearch) {
        result = await productService.searchProducts(urlSearch);
      } else if (urlCategory && urlCategory !== "All") {
        result = await productService.getByCategory(urlCategory);
      } else {
        result = await productService.getAll();
      }

      setProducts(result);
    } catch (err) {
      setError("Failed to load products");
      console.error("Product loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
    
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
    setIsSidebarOpen(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedCategory("All");
    
    if (query.trim()) {
      setSearchParams({ search: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-display gradient-text">
              Discover Amazing Products
            </h1>
            <p className="text-xl text-gray-600 font-body max-w-2xl mx-auto">
              Browse our curated collection of premium items from top brands
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Search for products..."
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              
              {/* Filter Summary */}
              <div className="bg-white rounded-xl p-4 card-shadow">
                <h4 className="font-display font-semibold text-secondary mb-2">
                  Active Filters
                </h4>
                <div className="space-y-2">
                  {selectedCategory !== "All" && (
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {selectedCategory}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                      "{searchQuery}"
                    </span>
                  )}
                  {selectedCategory === "All" && !searchQuery && (
                    <span className="text-gray-500 text-sm">
                      Showing all products
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ApperIcon name="Filter" className="w-5 h-5" />
              <span className="font-medium">Filters</span>
              {(selectedCategory !== "All" || searchQuery) && (
                <span className="w-2 h-2 bg-primary rounded-full"></span>
              )}
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-display text-secondary">
                {searchQuery ? `Search results for "${searchQuery}"` :
                 selectedCategory !== "All" ? selectedCategory : "All Products"}
              </h2>
              
              <div className="text-sm text-gray-600 font-body">
                {!loading && `${products.length} products`}
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              onRetry={loadProducts}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative bg-white w-80 max-w-xs h-full overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-display">Filters</h3>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;