"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { useWindowStore } from "@/store/windowStore";


interface AppWindowProps {
  id: string;
  children: React.ReactNode;
  defaultWidth?: number | string;
  defaultHeight?: number | string;
  minWidth?: number;
  minHeight?: number;
}

export default function AppWindow({
  id,
  children,
  defaultWidth = 800,
  defaultHeight = 600,
  minWidth = 320,
  minHeight = 400,
}: AppWindowProps) {
  const windowData = useWindowStore((state) => state.windows[id]);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const destroyWindow = useWindowStore((state) => state.destroyWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const maximizeWindow = useWindowStore((state) => state.maximizeWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);


  const windowRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Track viewport dimensions to calculate Genie target positions
  const [viewport, setViewport] = useState({ width: 1024, height: 768 });

  useEffect(() => {
    setViewport({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = activeWindowId === id;
  const isMobile = viewport.width < 768;

  // Genie animation vertical and horizontal targets matching the Dock icons
  const targetY = viewport.height / 2 - (isMobile ? 50 : 60);

  // Align precisely with the Dock app positions (in pixels relative to center)
  const targetX = id === "terminal" ? 60 : id === "chat" ? 120 : 0;

  useEffect(() => {
    let isMounted = true;

    // Tiny delay ensures Framer Motion has bound the ref to `controls` before starting the animation.
    const timer = setTimeout(() => {
      if (!isMounted) return;

      if (isMobile) {
        if (windowData?.isMinimized) {
          // If minimized on mobile (shouldn't happen via UI anymore, but just in case)
          controls.start({
            y: "100%",
            opacity: 0,
            scaleX: 1,
            scaleY: 1,
            skewX: 0,
          });
        } else {
          // Slide up from bottom
          controls.start({
            y: 0,
            opacity: 1,
            scaleX: 1,
            scaleY: 1,
            skewX: 0,
            width: "100vw",
            height: "90vh",
          });
        }
      } else {
        // Desktop Genie Animation
        if (windowData?.isMinimized) {
          controls.start({
            opacity: 0,
            scaleX: 0.01,
            scaleY: 0.02,
            x: targetX,
            y: targetY,
            skewX: 12,
          });
        } else {
          controls.start({
            opacity: 1,
            scaleX: 1,
            scaleY: 1,
            skewX: 0,
            width: windowData?.isMaximized ? "100vw" : defaultWidth,
            height: windowData?.isMaximized ? "100vh" : defaultHeight,
            x: windowData?.isMaximized ? 0 : 0,
            y: windowData?.isMaximized ? 0 : 0,
          });
        }
      }
    }, 50);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [windowData?.isMaximized, windowData?.isMinimized, defaultWidth, defaultHeight, controls, targetX, targetY, isMobile]);

  // Closing animation — fade and scale out for desktop, slide down for mobile
  useEffect(() => {
    if (!windowData?.isClosing) return;

    const closeAnimation = isMobile
      ? { y: "100%", opacity: 0, scaleX: 1, scaleY: 0.4, skewX: 0 }
      : {
          opacity: 0,
          scale: 0.9,
          y: 20,
        };

    controls.start({
      ...closeAnimation,
      transition: {
        duration: 0.25,
        ease: "easeOut",
      },
    }).then(() => {
      destroyWindow(id);
    });
  }, [windowData?.isClosing, isMobile, controls, id, destroyWindow]);

  if (!windowData || (!windowData.isOpen && !windowData.isClosing)) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: windowData.zIndex,
      }}
    >
      <motion.div
        key={`app-window-${id}`}
        ref={windowRef}
        id={`app-window-${id}`}
        drag={isMobile ? false : !windowData.isMaximized}
        dragConstraints={{
          top: -viewport.height / 2 + 50,
          bottom: viewport.height / 2 - 50,
          left: -viewport.width / 2 + 50,
          right: viewport.width / 2 - 50,
        }}
        dragMomentum={false}
        onMouseDown={() => focusWindow(id)}
        initial={
          isMobile
            ? { opacity: 0, y: "100%", x: 0, scaleX: 1, scaleY: 1, skewX: 0 }
            : { opacity: 0, scaleX: 0.8, scaleY: 0.8, x: 0, y: 20, skewX: 0 }
        }
        animate={controls}
        transition={{
          type: "spring",
          stiffness: 140,
          damping: 17,
          mass: 0.8
        }}
        style={{
          pointerEvents: windowData.isMinimized || windowData.isClosing ? "none" : "auto",
          position: isMobile ? "fixed" : (windowData.isMaximized ? "fixed" : "relative"),
          top: isMobile ? "auto" : (windowData.isMaximized ? 0 : undefined),
          bottom: isMobile ? 0 : undefined,
          left: isMobile ? 0 : (windowData.isMaximized ? 0 : undefined),
          minWidth: isMobile ? "100vw" : (windowData.isMaximized ? "100vw" : minWidth),
          minHeight: isMobile ? "90vh" : (windowData.isMaximized ? "100vh" : minHeight),
          transformOrigin: "bottom center", // Key to macOS Genie squeeze
          resize: !isMobile && !windowData.isMaximized ? "both" : "none",
        }}
        className={`flex flex-col overflow-hidden bg-zinc-950/80 backdrop-blur-3xl border ${isActive ? "border-white/20 shadow-2xl" : "border-white/10 shadow-lg"
          } ${isMobile ? "rounded-t-3xl rounded-b-none border-b-0" : windowData.isMaximized ? "rounded-none" : "rounded-xl"}`}
      >
        {/* Header / Title Bar */}
        <div
          className={`flex items-center px-4 py-3 border-b border-white/10 drag-handle select-none ${(!isMobile && !windowData.isMaximized) ? "cursor-grab active:cursor-grabbing" : ""
            } ${isActive ? "bg-white/5" : "bg-transparent"} ${isMobile ? "justify-between" : ""}`}
          onDoubleClick={() => !isMobile && maximizeWindow(id)}
        >
          {isMobile && (
            <div className="flex-1 flex justify-start">
              {/* Optional: Add a grab handle pill for mobile aesthetic */}
              <div className="w-10 h-1.5 bg-white/20 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2"></div>
            </div>
          )}

          {!isMobile && (
            <div className="flex items-center gap-2 group flex-shrink-0">
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeWindow(id);
                }}
                className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 flex items-center justify-center transition-colors outline-none"
                title="Close"
              >
                <X className="w-2 h-2 text-red-950 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Minimize Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  minimizeWindow(id);
                }}
                className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 flex items-center justify-center transition-colors outline-none"
                title="Minimize"
              >
                <Minus className="w-2 h-2 text-amber-950 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Maximize Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  maximizeWindow(id);
                }}
                className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 flex items-center justify-center transition-colors outline-none"
                title="Maximize"
              >
                {windowData.isMaximized ? (
                  <Minimize2 className="w-2 h-2 text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <Maximize2 className="w-2 h-2 text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            </div>
          )}

          {/* Window Title */}
          <div className={`flex-1 text-center ${!isMobile ? "pr-10" : ""}`}>
            <span className={`text-xs font-medium tracking-wide ${isActive ? "text-zinc-300" : "text-zinc-500"}`}>
              {windowData.title}
            </span>
          </div>

          {/* Mobile Done Button */}
          {isMobile && (
            <div className="flex-1 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeWindow(id);
                }}
                className="text-sky-400 font-semibold text-sm hover:text-sky-300 active:scale-95 transition-all outline-none"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-auto relative bg-zinc-950/50">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
