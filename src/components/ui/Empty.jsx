import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Package", 
  title = "Nothing here yet", 
  message = "Items will appear here when available",
  actionLabel = "Get Started",
  onAction = null 
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-background to-blue-50">
      <div className="text-center space-y-6 p-8 max-w-md">
        {/* Empty state icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon 
            name={icon} 
            className="w-12 h-12 text-blue-500"
          />
        </div>
        
        {/* Empty state content */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold font-display gradient-text">
            {title}
          </h3>
          <p className="text-gray-600 font-body leading-relaxed">
            {message}
          </p>
        </div>
        
        {/* Action button */}
        {onAction && (
          <button
            onClick={onAction}
            className="btn-primary px-8 py-3 rounded-lg font-medium font-body inline-flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;