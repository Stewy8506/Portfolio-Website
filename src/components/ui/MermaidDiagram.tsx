"use client";

import React, { useEffect, useRef, useState } from "react";

interface MermaidDiagramProps {
  code: string;
  id: string;
}

export default function MermaidDiagram({ code, id }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

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
          fontFamily: "var(--font-sans, Inter, sans-serif)",
          themeVariables: {
            background: "#09090b", // zinc-950
            primaryColor: "#27272a", // zinc-800
            primaryTextColor: "#f4f4f5", // zinc-100
            lineColor: "#3f3f46", // zinc-700
            nodeBorder: "#3f3f46",
            mainBkg: "#09090b",
            actorBorder: "#3f3f46",
            actorBkg: "#09090b",
            actorTextColor: "#f4f4f5",
          }
        });

        // Unique ID to avoid rendering collisions
        const cleanId = `mermaid-${id.replace(/[^a-zA-Z0-9-]/g, "")}`;
        
        // Render diagram
        const { svg: renderedSvg } = await mermaid.render(cleanId, code);
        
        if (isMounted) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err: any) {
        console.error("Mermaid Render Error:", err);
        if (isMounted) {
          setError(err.message || "Failed to render Mermaid diagram. Please check your syntax.");
        }
      }
    }

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [code, id]);

  if (error) {
    return (
      <div className="p-4 rounded-md border border-red-900/50 bg-red-950/20 text-red-400 text-xs font-mono max-h-48 overflow-y-auto">
        <p className="font-semibold mb-1">Diagram Syntax Error:</p>
        <p>{error}</p>
        <pre className="mt-2 p-2 bg-red-950/40 rounded text-[10px] text-red-300/80 overflow-x-auto">{code}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="flex items-center justify-center py-12 rounded-md border border-zinc-800 bg-zinc-950/20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-zinc-500 font-medium">Generating technical layout...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={elementRef}
      className="mermaid-container w-full overflow-x-auto flex justify-center bg-white/[0.01] border border-white/[0.06] rounded-3xl p-6 md:p-8 backdrop-blur-sm"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
