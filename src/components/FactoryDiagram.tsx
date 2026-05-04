'use client';

import React from 'react';
import { FactoryLayout } from '@/lib/layout';

export default function FactoryDiagram({ layout }: { layout: FactoryLayout }) {
  const scale = 5; // Slightly larger
  const padding = 150;

  return (
    <div className="overflow-auto bg-zinc-950 rounded-2xl border border-zinc-800 p-8 shadow-2xl relative custom-scrollbar">
      <div className="absolute top-4 right-4 flex gap-2">
         <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold">Machine</span>
         </div>
         <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-zinc-700"></div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold">Convoyeur</span>
         </div>
      </div>

      <svg
        width={layout.totalWidth * scale + padding * 2}
        height={layout.totalLength * scale + padding * 2}
        className="mx-auto"
      >
        <defs>
          <pattern id="grid" width={10 * scale} height={10 * scale} patternUnits="userSpaceOnUse">
            <path d={`M ${10 * scale} 0 L 0 0 0 ${10 * scale}`} fill="none" stroke="#18181b" strokeWidth="1"/>
          </pattern>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
          </marker>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        <g transform={`translate(${padding}, ${padding})`}>
          {/* Connections */}
          {layout.connections.map((conn, i) => {
            const from = layout.elements.find(e => e.id === conn.fromId);
            const to = layout.elements.find(e => e.id === conn.toId);
            if (!from || !to) return null;

            const x1 = (from.x + from.width / 2) * scale;
            const y1 = from.y * scale;
            const x2 = (to.x + to.width / 2) * scale;
            const y2 = (to.y + to.length) * scale;

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
            // Assign colors based on machine type
            let color = "#f97316"; // Default orange
            if (el.name.includes("Constructeur")) color = "#3b82f6"; // Blue
            if (el.name.includes("Assembleuse")) color = "#a855f7"; // Purple
            if (el.name.includes("Façonneuse")) color = "#ec4899"; // Pink
            if (el.name.includes("Raffinerie")) color = "#10b981"; // Green
            if (el.name.includes("Fonderie")) color = "#ef4444"; // Red

            return (
            <g key={el.id} transform={`translate(${el.x * scale}, ${el.y * scale})`} className="group cursor-pointer">
              {/* External Shadow/Glow */}
              <rect
                width={el.width * scale}
                height={el.length * scale}
                fill={color}
                className="opacity-0 group-hover:opacity-10 transition-opacity"
                rx="4"
              />

              {/* Machine Body */}
              <rect
                width={el.width * scale}
                height={el.length * scale}
                fill="#18181b"
                stroke={color}
                strokeWidth="2"
                rx="4"
              />

              {/* Status Indicator */}
              <circle cx="8" cy="8" r="3" fill={color} className="animate-pulse" />

              {/* Ports (I/O) */}
              {/* Input (Bottom) */}
              <rect
                x={el.width * scale / 2 - 4}
                y={el.length * scale - 2}
                width="8"
                height="4"
                fill="#f97316"
              />
              {/* Output (Top) */}
              <rect
                x={el.width * scale / 2 - 4}
                y={-2}
                width="8"
                height="4"
                fill="#f97316"
              />

              {/* Industrial Details */}
              <rect x="10%" y="20%" width="80%" height="2" fill="#27272a" />
              <rect x="10%" y="80%" width="80%" height="2" fill="#27272a" />

              <text
                x={el.width * scale / 2}
                y={el.length * scale / 2 - 4}
                fill="white"
                fontSize="9"
                textAnchor="middle"
                className="font-black uppercase tracking-tighter"
              >
                {el.name}
              </text>

              <text
                x={el.width * scale / 2}
                y={el.length * scale / 2 + 10}
                fill={color}
                fontSize="7"
                textAnchor="middle"
                className="uppercase font-black"
              >
                {el.targetItemId.replace(/-/g, ' ')}
              </text>
            </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
