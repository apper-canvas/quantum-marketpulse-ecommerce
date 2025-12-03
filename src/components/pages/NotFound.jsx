import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* 404 Illustration */}
          <div className="relative">
            <div className="text-[120px] md:text-[200px] font-bold font-display gradient-text leading-none">
              404
            </div>
            
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center"
            >
              <ApperIcon name="Search" className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold font-display text-secondary">
              Page Not Found
            </h1>
            
            <p className="text-lg text-gray-600 font-body max-w-lg mx-auto">
              Oops! The page you're looking for seems to have wandered off. 
              Let's get you back to shopping for amazing products.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="w-full sm:w-auto"
            >
              <ApperIcon name="Home" className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => navigate("/categories")}
              size="lg"
              className="w-full sm:w-auto"
            >
              <ApperIcon name="Grid3x3" className="w-5 h-5 mr-2" />
              Browse Categories
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-body mb-4">
              Or try one of these popular sections:
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { name: "Electronics", href: "/?category=Electronics" },
                { name: "Fashion", href: "/?category=Fashion" },
                { name: "Home", href: "/?category=Home" },
                { name: "Sports", href: "/?category=Sports" }
              ].map((link) => (
                <button
                  key={link.name}
                  onClick={() => navigate(link.href)}
                  className="text-primary hover:text-red-500 font-medium font-body text-sm transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;