"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Network } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MermaidDiagramProps {
  code: string;
  id: string;
}

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 10.0;
const ZOOM_STEP = 0.2;

export default function MermaidDiagram({ code, id }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const elementRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  useEffect(() => {
    let isMounted = true;

    async function renderDiagram() {
      if (typeof window === "undefined") return;

      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          fontFamily: "var(--font-geist-sans, Inter, sans-serif)",
          fontSize: 18,
        });

        const cleanId = `mermaid-${id.replace(/[^a-zA-Z0-9-]/g, "")}`;
        const { svg: renderedSvg } = await mermaid.render(cleanId, code);

        if (isMounted) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err: any) {
        console.error("Mermaid Render Error:", err);
        if (isMounted) {
          setError(err.message || "Failed to render diagram. Please check the syntax.");
        }
      }
    }

    renderDiagram();
    return () => { isMounted = false; };
  }, [code, id]);

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM)), []);
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(z - ZOOM_STEP, MIN_ZOOM)), []);
  const handleReset = useCallback(() => setZoom(1), []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!viewportRef.current) return;
    isDragging.current = true;
    startPos.current = {
      x: e.pageX - viewportRef.current.offsetLeft,
      y: e.pageY - viewportRef.current.offsetTop,
      scrollLeft: viewportRef.current.scrollLeft,
      scrollTop: viewportRef.current.scrollTop,
    };
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !viewportRef.current) return;
    e.preventDefault();
    const x = e.pageX - viewportRef.current.offsetLeft;
    const y = e.pageY - viewportRef.current.offsetTop;
    const walkX = (x - startPos.current.x) * 1.5;
    const walkY = (y - startPos.current.y) * 1.5;
    viewportRef.current.scrollLeft = startPos.current.scrollLeft - walkX;
    viewportRef.current.scrollTop = startPos.current.scrollTop - walkY;
  };

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-4 rounded-2xl border border-red-900/40 bg-red-950/15 text-red-400 text-xs font-mono max-h-48 overflow-y-auto">
        <p className="font-semibold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
          Diagram Syntax Error
        </p>
        <p className="text-red-300/80">{error}</p>
        <pre className="mt-2 p-2 bg-red-950/40 rounded text-[10px] text-red-300/60 overflow-x-auto">{code}</pre>
      </div>
    );
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!svg) {
    return (
      <div className="diagram-border-animated rounded-3xl">
        <div className="flex items-center justify-center py-16 rounded-3xl bg-zinc-950/60 diagram-grid-bg border border-white/[0.05] backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Network className="w-8 h-8 text-zinc-700" />
              <div className="absolute -inset-3 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
            </div>
            <span className="text-xs text-zinc-500 font-medium tracking-widest uppercase">
              Rendering diagram…
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative group w-full ${isFullscreen ? "bg-zinc-950 p-0 md:p-8 flex items-center justify-center" : "diagram-border-animated rounded-3xl"}`}
    >
      <div
        className={`relative w-full overflow-hidden diagram-grid-bg border border-white/[0.06] backdrop-blur-sm transition-all duration-500 ${
          isFullscreen ? "h-full flex flex-col rounded-3xl" : "rounded-3xl bg-zinc-950/70"
        }`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05] bg-white/[0.01] flex-shrink-0">
          <div className="flex items-center gap-2.5 group/controls">
            {/* Traffic-light dots */}
            <button 
              onClick={() => isFullscreen && toggleFullscreen()}
              className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${isFullscreen ? "bg-red-500 hover:bg-red-400" : "bg-zinc-800 opacity-50 cursor-not-allowed"}`}
              disabled={!isFullscreen}
              title={isFullscreen ? "Close Fullscreen" : ""}
            >
              {isFullscreen && <span className="text-[8px] text-red-950 font-bold opacity-0 group-hover/controls:opacity-100 hidden md:block">x</span>}
            </button>
            <button 
              onClick={handleReset}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center transition-all"
              title="Reset Zoom"
            >
              <span className="text-[8px] text-yellow-950 font-bold opacity-0 group-hover/controls:opacity-100 hidden md:block">-</span>
            </button>
            <button 
              onClick={toggleFullscreen}
              className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center transition-all"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              <span className="text-[8px] text-emerald-950 font-bold opacity-0 group-hover/controls:opacity-100 hidden md:block">+</span>
            </button>
            <span className="ml-3 text-[10px] font-medium text-zinc-600 tracking-widest uppercase select-none">
              Interactive Diagram
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-zinc-700 mr-2 tabular-nums select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomOut}
              disabled={zoom <= MIN_ZOOM}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= MAX_ZOOM}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Diagram viewport wrapper */}
        <div className={`relative flex-1 flex flex-col ${isFullscreen ? "min-h-0" : "min-h-[400px]"}`}>
          {/* Left + right edge fade for overflow hint (Absolute so they don't scroll) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 z-10"
            style={{ background: "linear-gradient(to right, rgba(9,9,11,0.6), transparent)" }}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10"
            style={{ background: "linear-gradient(to left, rgba(9,9,11,0.6), transparent)" }}
          />

          {/* Actual scrollable viewport */}
          <div
            ref={viewportRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`w-full h-full overflow-auto flex-1 ${isFullscreen ? "" : "p-6 md:p-10"}`}
            style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
          >
            <div className="min-w-full min-h-full flex items-center justify-center p-8 select-none pointer-events-none">
              <style dangerouslySetInnerHTML={{ __html: `
                .mermaid-container svg {
                  max-width: none !important;
                  height: auto !important;
                  background: transparent !important;
                }
                .mermaid-container .er.entityBox {
                  fill: rgba(24, 24, 27, 0.9) !important;
                  stroke: rgba(63, 63, 70, 0.8) !important;
                }
                .mermaid-container .er.entityLabel {
                  fill: #ffffff !important;
                  font-weight: bold !important;
                  font-size: 1.1em !important;
                }
                .mermaid-container .er.attributeBoxOdd {
                  fill: rgba(39, 39, 42, 0.5) !important;
                }
                .mermaid-container .er.attributeBoxEven {
                  fill: rgba(24, 24, 27, 0.5) !important;
                }
                .mermaid-container .er.relationshipLabel {
                  fill: #a1a1aa !important;
                  background-color: rgba(9, 9, 11, 0.8) !important;
                }
              `}} />
              <div
                ref={elementRef}
                className="mermaid-container transition-transform duration-200 ease-out origin-center"
                style={{ transform: `scale(${zoom})` }}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        {!isFullscreen && (
          <div className="flex items-center justify-center gap-4 px-5 py-2.5 border-t border-white/[0.04] bg-white/[0.005]">
            <span className="text-[9px] text-zinc-700 tracking-widest uppercase font-medium select-none">
              Click & Drag to pan · Use green dot for fullscreen · yellow dot to reset zoom
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
