"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import Magnetic from "./Magnetic";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary: "bg-zinc-800 text-white hover:bg-zinc-700",
    outline: "border border-zinc-700 text-white hover:bg-zinc-800",
  };

  // Extract layout/width classes to apply to the Magnetic wrapper
  const widthClasses = className?.match(/\b(w-\S+|sm:w-\S+|md:w-\S+|lg:w-\S+|xl:w-\S+|flex-1)\b/g)?.join(" ") || "";

  return (
    <Magnetic className={widthClasses}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "px-6 py-3 rounded-full font-medium transition-colors duration-200",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    </Magnetic>
  );
}
