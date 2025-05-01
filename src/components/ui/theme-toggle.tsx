"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full relative"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
        animate={{ 
          scale: theme === "dark" ? 1 : 0, 
          opacity: theme === "dark" ? 1 : 0,
          rotate: theme === "dark" ? 0 : -30
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Moon className="h-5 w-5" />
      </motion.div>
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: 30 }}
        animate={{ 
          scale: theme === "light" ? 1 : 0, 
          opacity: theme === "light" ? 1 : 0,
          rotate: theme === "light" ? 0 : 30
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Sun className="h-5 w-5" />
      </motion.div>
      
      {/* Fallback icons for SSR */}
      <Sun className="h-5 w-5 dark:hidden transition-all" />
      <Moon className="h-5 w-5 hidden dark:block transition-all" />
    </Button>
  );
}
