"use client";

import React, { useEffect, useRef } from "react";

interface NoiseOverlayProps {
  opacity?: number;
  grainSize?: number;
  fps?: number;
}

export default function NoiseOverlay({
  opacity = 0.02,
  grainSize = 1.8,
  fps = 12,
}: NoiseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let lastFrameTime = 0;
    const interval = 1000 / fps;

    const drawNoise = () => {
      const width = canvas.width;
      const height = canvas.height;

      const imgData = ctx.createImageData(width, height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const bright = Math.random();

        // Gaussian-ish: only render grain when value is near extremes
        if (bright < 0.08 || bright > 0.92) {
          const isWhite = bright > 0.5;
          const baseOpacity = isWhite
            ? (bright - 0.85) / 0.15
            : (0.15 - bright) / 0.15;

          const alpha = Math.floor(opacity * baseOpacity * 255);
          const color = isWhite ? 255 : 0;

          data[i] = color;     // R
          data[i + 1] = color; // G
          data[i + 2] = color; // B
          data[i + 3] = alpha; // A
        } else {
          data[i + 3] = 0; // Transparent
        }
      }

      ctx.putImageData(imgData, 0, 0);
    };

    const handleResize = () => {
      // Scale down canvas for grainSize and CSS handles scaling it up
      canvas.width = Math.ceil(window.innerWidth / grainSize);
      canvas.height = Math.ceil(window.innerHeight / grainSize);
      drawNoise();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const render = (time: number) => {
      if (time - lastFrameTime >= interval) {
        lastFrameTime = time;
        drawNoise();
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [opacity, grainSize, fps]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
