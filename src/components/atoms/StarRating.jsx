import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StarRating = ({ rating, maxStars = 5, size = 16, className }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className={cn("flex items-center space-x-0.5", className)}>
      {[...Array(maxStars)].map((_, index) => {
        if (index < fullStars) {
          return (
            <ApperIcon 
              key={index}
              name="Star" 
              size={size}
              className="text-accent fill-current"
            />
          );
        } else if (index === fullStars && hasHalfStar) {
          return (
            <div key={index} className="relative">
              <ApperIcon 
                name="Star" 
                size={size}
                className="text-gray-300"
              />
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <ApperIcon 
                  name="Star" 
                  size={size}
                  className="text-accent fill-current"
                />
              </div>
            </div>
          );
        } else {
          return (
            <ApperIcon 
              key={index}
              name="Star" 
              size={size}
              className="text-gray-300"
            />
          );
        }
      })}
      <span className="ml-2 text-sm text-gray-600 font-body">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
};

export default StarRating;