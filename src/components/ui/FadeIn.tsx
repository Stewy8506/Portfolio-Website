"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useLoading } from "../layout/ClientLayoutWrapper";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  className?: string;
}

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  duration = 0.5,
  className,
}: FadeInProps) {
  const { isSiteReady } = useLoading();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.98,
      x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
      y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Custom quintic out ease for a more premium feel
      },
    },
  };

  if (!isSiteReady) {
    return (
      <div 
        className={cn("opacity-0 scale-[0.98] will-change-transform", className)}
        style={{
          transform: direction === "up" ? "translateY(20px)" : direction === "down" ? "translateY(-20px)" : direction === "left" ? "translateX(20px)" : direction === "right" ? "translateX(-20px)" : "none"
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
