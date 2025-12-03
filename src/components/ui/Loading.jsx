import React from "react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-background to-slate-50">
      <div className="text-center space-y-6 p-8">
        {/* Animated spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto"></div>
          <div className="w-12 h-12 border-3 border-transparent border-t-accent rounded-full animate-spin absolute top-2 left-2 mx-auto"></div>
        </div>
        
        {/* Loading text */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-secondary gradient-text">{message}</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;