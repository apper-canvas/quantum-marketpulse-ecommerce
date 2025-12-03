import React from "react";
import { cn } from "@/utils/cn";

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  className 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="font-display font-semibold text-secondary text-lg mb-4">
        Categories
      </h3>
      
      <div className="space-y-1">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-body",
              selectedCategory === category
                ? "bg-gradient-to-r from-primary/10 to-red-100 text-primary border border-primary/20 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-secondary"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;