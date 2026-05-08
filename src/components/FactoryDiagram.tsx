'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { FactoryLayout } from '@/lib/layout';

export default function FactoryDiagram({ layout }: { layout: FactoryLayout }) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const baseScale = 5;
  const padding = 150;

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setZoom(prev => Math.min(Math.max(0.1, prev * delta), 5));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
        setOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
        ref={containerRef}
        className={`overflow-hidden bg-zinc-950 transition-all duration-500 shadow-2xl relative cursor-grab active:cursor-grabbing select-none ${
          isFullscreen
            ? 'fixed inset-0 z-[100] p-8'
            : 'rounded-2xl border border-zinc-800 h-[600px] w-full'
        }`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
    >
      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-4 z-20">
         <div className="flex gap-4 bg-zinc-900/80 backdrop-blur-md p-3 rounded-xl border border-zinc-700 shadow-xl">
            <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Machine</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-zinc-700"></div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Convoyeur</span>
            </div>
         </div>

         <div className="flex flex-col gap-2 bg-zinc-900/80 backdrop-blur-md p-2 rounded-xl border border-zinc-700 shadow-xl self-end">
            <button onClick={(e) => { e.stopPropagation(); setIsFullscreen(!isFullscreen); }} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-800 rounded-lg text-orange-500 font-bold">
               {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <div className="h-px bg-zinc-800 mx-1"></div>
            <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(z + 0.1, 5)); }} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-800 rounded-lg text-orange-500 font-bold">+</button>
            <div className="h-px bg-zinc-800 mx-1"></div>
            <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(z - 0.1, 0.1)); }} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-800 rounded-lg text-orange-500 font-bold">−</button>
            <div className="h-px bg-zinc-800 mx-1"></div>
            <button onClick={(e) => { e.stopPropagation(); resetView(); }} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-800 rounded-lg text-zinc-500 text-[8px] font-black uppercase">Reset</button>
         </div>
      </div>

      <div className="absolute bottom-4 left-4 z-10 bg-zinc-900/50 backdrop-blur px-3 py-1 rounded-full border border-zinc-800 text-[9px] font-mono text-zinc-500">
        ZOOM: {(zoom * 100).toFixed(0)}% | CTRL + WHEEL POUR ZOOMER | GLISSER POUR NAVIGUER
      </div>

      <svg
        width="100%"
        height="100%"
        className="touch-none"
      >
        <defs>
          <pattern id="grid" width={10 * baseScale} height={10 * baseScale} patternUnits="userSpaceOnUse">
            <path d={`M ${10 * baseScale} 0 L 0 0 0 ${10 * baseScale}`} fill="none" stroke="#18181b" strokeWidth="1"/>
          </pattern>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
          </marker>
        </defs>

        <g transform={`translate(${offset.x + padding * zoom}, ${offset.y + padding * zoom}) scale(${zoom})`}>
          <rect x={-padding} y={-padding} width={layout.totalWidth * baseScale + padding * 2} height={layout.totalLength * baseScale + padding * 2} fill="url(#grid)" />

          {/* Connections */}
          {layout.connections.map((conn, i) => {
            const from = layout.elements.find(e => e.id === conn.fromId);
            const to = layout.elements.find(e => e.id === conn.toId);
            if (!from || !to) return null;

            const x1 = (from.x + from.width / 2) * baseScale;
            const y1 = from.y * baseScale;
            const x2 = (to.x + to.width / 2) * baseScale;
            const y2 = (to.y + to.length) * baseScale;

            return (
              <g key={`conn-${i}`}>
                <path
                  d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}`}
                  stroke="#3f3f46"
                  strokeWidth="3"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className="transition-all hover:stroke-orange-500/50"
                />
                <rect
                    x={(x1 + x2) / 2 - 25}
                    y={(y1 + y2) / 2 - 10}
                    width="50"
                    height="14"
                    rx="4"
                    fill="#18181b"
                    stroke="#27272a"
                />
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2}
                  fill="#f97316"
                  fontSize="8"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-mono font-black"
                >
                  {conn.amount.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Machines */}
          {layout.elements.map((el) => {
            let color = "#f97316";
            if (el.name.includes("Constructeur")) color = "#3b82f6";
            if (el.name.includes("Assembleuse")) color = "#a855f7";
            if (el.name.includes("Façonneuse")) color = "#ec4899";
            if (el.name.includes("Raffinerie")) color = "#10b981";
            if (el.name.includes("Fonderie")) color = "#ef4444";

            return (
              <g key={el.id} transform={`translate(${el.x * baseScale}, ${el.y * baseScale})`} className="group cursor-pointer">
                <rect
                  width={el.width * baseScale}
                  height={el.length * baseScale}
                  fill={color}
                  className="opacity-0 group-hover:opacity-10 transition-opacity"
                  rx="4"
                />
                <rect
                  width={el.width * baseScale}
                  height={el.length * baseScale}
                  fill="#18181b"
                  stroke={color}
                  strokeWidth="2"
                  rx="4"
                />
                <circle cx="8" cy="8" r="3" fill={color} className="animate-pulse" />
                <rect x={el.width * baseScale / 2 - 4} y={el.length * baseScale - 2} width="8" height="4" fill={color} />
                <rect x={el.width * baseScale / 2 - 4} y={-2} width="8" height="4" fill={color} />
                <rect x="10%" y="20%" width="80%" height="2" fill="#27272a" />
                <rect x="10%" y="80%" width="80%" height="2" fill="#27272a" />
                <text x={el.width * baseScale / 2} y={el.length * baseScale / 2 - 4} fill="white" fontSize="9" textAnchor="middle" className="font-black uppercase tracking-tighter">{el.name}</text>
                <text x={el.width * baseScale / 2} y={el.length * baseScale / 2 + 10} fill={color} fontSize="7" textAnchor="middle" className="uppercase font-black">{el.targetItemId.replace(/-/g, ' ')}</text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
