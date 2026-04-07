"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

// Dynamically import react-force-graph-2d with SSR disabled
// since it relies on window and canvas
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-50/50 dark:bg-gray-950/50">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
    </div>
  ),
});

export type GraphNode = {
  id: string;
  name: string;
  val: number; // for size
  color?: string;
  noteId?: string; // Optional: Link back to a specific note if rendering global
};

export type GraphLink = {
  source: string;
  target: string;
  label: string;
};

export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

interface KnowledgeGraphProps {
  data: GraphData;
  width?: number;
  height?: number;
  onNodeClick?: (node: GraphNode) => void;
}

export default function KnowledgeGraph({ data, width, height, onNodeClick }: KnowledgeGraphProps) {
  const { resolvedTheme } = useTheme();
  const graphRef = useRef<any>(null);

  const [dimensions, setDimensions] = useState({ width: width || 800, height: height || 400 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!width || !height) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (!entries || !entries.length) return;
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height: height || 400 });
      });

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => resizeObserver.disconnect();
    }
  }, [width, height]);

  // Adjust zoom to fit nodes when data changes
  useEffect(() => {
    if (graphRef.current && data.nodes.length > 0) {
      // Zoom to fit padding
      setTimeout(() => {
        graphRef.current?.zoomToFit(400, 50);
      }, 500);
    }
  }, [data]);

  const isDark = resolvedTheme === "dark";

  const textColor = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)";
  const linkColor = isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.15)";
  const nodeColor = isDark ? "#6366f1" : "#4f46e5"; // Indigo standard
  const highlightColor = isDark ? "#10b981" : "#059669"; // Emerald highlight

  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden rounded-xl bg-white/40 dark:bg-gray-950/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50">
      <ForceGraph2D
        ref={graphRef}
        width={width || dimensions.width}
        height={height || dimensions.height}
        graphData={data}
        nodeLabel="name"
        nodeColor={(node: any) => node.color || nodeColor}
        nodeRelSize={6}
        linkColor={() => linkColor}
        linkWidth={1.5}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        onNodeClick={(node: any) => {
          // Add a simple animation bounce on click
          if (graphRef.current) {
            graphRef.current.centerAt(node.x, node.y, 1000);
            graphRef.current.zoom(8, 2000);
          }
          if (onNodeClick) onNodeClick(node as GraphNode);
        }}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            (n) => n + fontSize * 0.2
          );

          ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)";
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            bckgDimensions[0],
            bckgDimensions[1]
          );

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = node.color || textColor;
          ctx.fillText(label, node.x, node.y);

          // Draw the circle behind text or below it
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val || 4, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color || nodeColor;
          ctx.fill();
        }}
      />
    </div>
  );
}
