import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: "Electronics",
      description: "Latest gadgets, smartphones, laptops and tech accessories",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop&crop=center",
      icon: "Smartphone",
      itemCount: "200+ items",
      color: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      name: "Fashion",
      description: "Trendy clothing, shoes, and accessories for every style",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&crop=center",
      icon: "Shirt",
      itemCount: "500+ items",
      color: "from-pink-500 to-red-600"
    },
    {
      id: 3,
      name: "Home",
      description: "Furniture, decor, kitchen appliances and home essentials",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center",
      icon: "Home",
      itemCount: "300+ items",
      color: "from-green-500 to-teal-600"
    },
    {
      id: 4,
      name: "Sports",
      description: "Fitness equipment, sporting goods and outdoor gear",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
      icon: "Trophy",
      itemCount: "150+ items",
      color: "from-orange-500 to-yellow-600"
    }
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/?category=${categoryName}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-display gradient-text">
              Shop by Category
            </h1>
            <p className="text-xl text-gray-600 font-body max-w-3xl mx-auto">
              Discover our carefully curated collections designed to meet all your shopping needs
            </p>
          </motion.div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleCategoryClick(category.name)}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl card-shadow overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`} />
                  
                  {/* Icon */}
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <ApperIcon name={category.icon} className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Category Name on Image */}
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold font-display">
                      {category.name}
                    </h3>
                    <p className="text-white/90 text-sm font-body">
                      {category.itemCount}
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-4">
                  <p className="text-gray-600 font-body leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-medium font-body group-hover:text-red-600 transition-colors">
                      Browse {category.name}
                    </span>
                    <ApperIcon 
                      name="ArrowRight" 
                      className="w-5 h-5 text-primary group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-200" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Collections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold font-display text-secondary">
              Featured Collections
            </h2>
            <p className="text-gray-600 font-body max-w-2xl mx-auto">
              Handpicked selections of our best products across all categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Best Sellers */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                <ApperIcon name="TrendingUp" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold font-display text-secondary">
                Best Sellers
              </h3>
              <p className="text-gray-600 font-body">
                Our most popular products loved by customers
              </p>
              <button 
                onClick={() => navigate("/")}
                className="text-primary hover:text-red-500 font-medium font-body"
              >
                Shop Now →
              </button>
            </div>

            {/* New Arrivals */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <ApperIcon name="Sparkles" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold font-display text-secondary">
                New Arrivals
              </h3>
              <p className="text-gray-600 font-body">
                Latest products fresh from our suppliers
              </p>
              <button 
                onClick={() => navigate("/")}
                className="text-blue-600 hover:text-blue-700 font-medium font-body"
              >
                Discover →
              </button>
            </div>

            {/* Sale Items */}
            <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-xl p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                <ApperIcon name="Percent" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold font-display text-secondary">
                Sale Items
              </h3>
              <p className="text-gray-600 font-body">
                Amazing deals and discounts on quality products
              </p>
              <button 
                onClick={() => navigate("/")}
                className="text-red-600 hover:text-red-700 font-medium font-body"
              >
                Save Now →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;