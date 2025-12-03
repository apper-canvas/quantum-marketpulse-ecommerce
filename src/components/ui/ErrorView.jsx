import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ 
  message = "Something went wrong", 
  onRetry = null,
  showRetry = true 
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-background to-red-50">
      <div className="text-center space-y-6 p-8 max-w-md">
        {/* Error icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon 
            name="AlertTriangle" 
            className="w-10 h-10 text-red-500"
          />
        </div>
        
        {/* Error message */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold font-display text-secondary">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 font-body">
            {message}
          </p>
        </div>
        
        {/* Retry button */}
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary px-6 py-3 rounded-lg font-medium font-body inline-flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
          >
            <ApperIcon name="RefreshCcw" className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorView;