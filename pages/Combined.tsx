import React, { useState, useEffect, useRef } from "react";
import GridLayout, { noCompactor } from "react-grid-layout";
import type { Layout } from "react-grid-layout";
import Home from "./Home";
import Review from "./Review";
import Time from "./Time";

const LAYOUT_KEY = "combined-page-layout";

const defaultLayout = [
  { i: "home", x: 0, y: 0, w: 6, h: 2, minW: 3, minH: 1 },
  { i: "review", x: 6, y: 0, w: 6, h: 2, minW: 3, minH: 1 },
  { i: "time", x: 0, y: 2, w: 12, h: 1, minW: 3, minH: 1 },
] as Layout;

const Combined: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [layout, setLayout] = useState<Layout>(() => {
    const saved = localStorage.getItem(LAYOUT_KEY);
    return saved ? JSON.parse(saved) : defaultLayout;
  });

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleLayoutChange = (newLayout: Layout) => {
    setLayout(newLayout);
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(newLayout));
  };

  const resetLayout = () => {
    setLayout(defaultLayout);
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(defaultLayout));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-sky-900 text-slate-100 p-4">
      <div ref={containerRef} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Combined Dashboard
          </h1>
          <button
            onClick={resetLayout}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition duration-200 text-sm"
          >
            Reset Layout
          </button>
        </div>

        <GridLayout
          className="layout"
          layout={layout}
          width={containerWidth}
          gridConfig={{
            cols: 12,
            rowHeight: 300,
          }}
          dragConfig={{
            handle: ".drag-handle",
          }}
          compactor={noCompactor}
          onLayoutChange={handleLayoutChange}
        >
          <div
            key="home"
            className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="drag-handle bg-slate-700/50 p-2 cursor-move border-b border-slate-600 flex items-center justify-between">
              <span className="text-sm font-semibold text-cyan-400">
                Home - Weather Compare
              </span>
              <span className="text-xs text-slate-500">Drag to move</span>
            </div>
            <div className="h-[calc(100%-40px)] overflow-auto hide-scrollbar">
              <Home />
            </div>
          </div>

          <div
            key="review"
            className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="drag-handle bg-slate-700/50 p-2 cursor-move border-b border-slate-600 flex items-center justify-between">
              <span className="text-sm font-semibold text-cyan-400">
                Review - 3 Week Forecast
              </span>
              <span className="text-xs text-slate-500">Drag to move</span>
            </div>
            <div className="h-[calc(100%-40px)] overflow-auto hide-scrollbar">
              <Review />
            </div>
          </div>

          <div
            key="time"
            className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="drag-handle bg-slate-700/50 p-2 cursor-move border-b border-slate-600 flex items-center justify-between">
              <span className="text-sm font-semibold text-cyan-400">
                Time - Live Clock
              </span>
              <span className="text-xs text-slate-500">Drag to move</span>
            </div>
            <div className="h-[calc(100%-40px)] overflow-auto hide-scrollbar">
              <Time />
            </div>
          </div>
        </GridLayout>
      </div>
    </div>
  );
};

export default Combined;
