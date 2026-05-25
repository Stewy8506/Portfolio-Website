"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [targetRect, setTargetRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      
      // Ignore elements explicitly marked with data-cursor="none"
      if (target.closest("[data-cursor='none']")) {
        setTargetRect(null);
        setIsViewMode(false);
        return;
      }

      const viewElement = target.closest("[data-cursor='view']");
      if (viewElement) {
        setIsViewMode(true);
        setTargetRect(null);
        return;
      }

      const interactiveElement = target.closest("button, a, [data-cursor='target']");

      if (interactiveElement) {
        setIsViewMode(false);
        const rect = interactiveElement.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setTargetRect(null);
        setIsViewMode(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible, mouseX, mouseY]);

  return (
    <>
      {/* The actual mouse pointer dot */}
      <motion.div
        className="hidden md:flex fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference items-center justify-center overflow-hidden"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isViewMode ? 10 : targetRect ? 0.5 : 1,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        <AnimatePresence>
          {isViewMode && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 0.1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-black flex items-center justify-center w-7 h-7"
            >
              <svg 
                className="w-full h-full stroke-black" 
                viewBox="0 0 24 24" 
                fill="none" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {targetRect && !isViewMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="hidden md:flex fixed pointer-events-none z-[9999] mix-blend-difference"
            style={{
              top: targetRect.top,
              left: targetRect.left,
              width: targetRect.width,
              height: targetRect.height,
            }}
          >
            {/* Top-Left Corner */}
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"
            />
            {/* Top-Right Corner */}
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"
            />
            {/* Bottom-Left Corner */}
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"
            />
            {/* Bottom-Right Corner */}
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
