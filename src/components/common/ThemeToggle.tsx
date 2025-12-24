"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { toggleTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
        <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-gray-400 opacity-0 min-w-[44px] min-h-[44px]"></div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-brand-500 dark:hover:text-brand-400 transition-all border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md active:scale-95 group relative overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="relative z-10">
        {theme === "light" ? (
          <Moon className="h-5 w-5 animate-in zoom-in-50 duration-300" />
        ) : (
          <Sun className="h-5 w-5 animate-in spin-in-90 duration-300" />
        )}
      </div>
      
      {/* Subtle hover effect background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </button>
  );
}
