"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Memoize the scroll handler to prevent unnecessary re-renders
  const toggleVisibility = useCallback(() => {
    const heroHeight = window.innerHeight * 0.8;
    const scrolled = window.scrollY > heroHeight;
    const shouldShowScrollTop = window.scrollY > window.innerHeight;
    
    setIsVisible(prev => prev !== scrolled ? scrolled : prev);
    setShowScrollTop(prev => prev !== shouldShowScrollTop ? shouldShowScrollTop : prev);
  }, []);

  // Memoize the debounced function
  const debouncedToggle = useMemo(() => debounce(toggleVisibility, 16), [toggleVisibility]);

  useEffect(() => {
    window.addEventListener("scroll", debouncedToggle, { passive: true });
    
    return () => window.removeEventListener("scroll", debouncedToggle);
  }, [debouncedToggle]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-3"
        >
          {/* Main CTA Button */}
          <Link href="/apply" aria-label="Join XueDAO - Apply to become a member">
            <Button 
              size="lg"
              className="group bg-xuedao_pink hover:bg-xuedao_pink/90 text-white font-bold shadow-2xl hover:shadow-3xl rounded-full px-4 sm:px-6 py-2 sm:py-3 transition-all duration-300 hover:scale-110 touch-manipulation h-12 sm:h-14 text-sm sm:text-base focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
              role="button"
              tabIndex={0}
            >
              <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Join Now</span>
              <span className="sm:hidden">Join</span>
            </Button>
          </Link>
          
          {/* Scroll to top button */}
          {showScrollTop && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                onClick={scrollToTop}
                size="icon"
                variant="outline"
                className="rounded-full bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 touch-manipulation h-10 w-10 sm:h-12 sm:w-12 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Scroll to top of page"
                title="Scroll to top"
              >
                <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}