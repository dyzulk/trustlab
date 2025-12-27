import React from "react";

interface PageLoaderProps {
  text?: string;
  className?: string;
}

export default function PageLoader({ text = "Loading...", className = "min-h-[60vh]" }: PageLoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center gap-4">
             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/10">
                  <svg className="animate-spin h-6 w-6 text-brand-500 dark:text-brand-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
             </div>
             <span className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">{text}</span>
        </div>
    </div>
  );
}
