"use client";

import React, { useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end";
  className?: string;
}

export default function Tooltip({ 
  content, 
  children, 
  position = "top", 
  className = "" 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    "top-start": "bottom-full left-0 mb-2",
    "top-end": "bottom-full right-0 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    "bottom-start": "top-full left-0 mt-2",
    "bottom-end": "top-full right-0 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-gray-800",
    "top-start": "top-full left-4 border-t-gray-800",
    "top-end": "top-full right-4 border-t-gray-800",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-800",
    "bottom-start": "bottom-full left-4 border-b-gray-800",
    "bottom-end": "bottom-full right-4 border-b-gray-800",
    left: "left-full top-1/2 -translate-y-1/2 border-l-gray-800",
    right: "right-full top-1/2 -translate-y-1/2 border-r-gray-800",
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-99999 px-3 py-2 text-xs font-medium text-white bg-gray-900 border border-gray-800 rounded-lg shadow-theme-lg dark:bg-gray-800 dark:border-gray-700 w-max max-w-[180px] sm:max-w-[250px] break-words animate-slide-in ${positionClasses[position]}`}>
          {content}
          <div className={`absolute border-4 border-transparent ${arrowClasses[position]}`}></div>
        </div>
      )}
    </div>
  );
}
