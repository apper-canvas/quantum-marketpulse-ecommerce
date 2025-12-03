import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  label,
  error,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-3 rounded-lg border transition-all duration-200 font-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1";
  
  const stateStyles = error 
    ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
    : "border-gray-300 focus:border-primary focus:ring-primary/20";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-secondary font-body">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={cn(baseStyles, stateStyles, className)}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 font-body">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;