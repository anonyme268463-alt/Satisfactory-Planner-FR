'use client';

import React from 'react';
import { FactoryLayout } from '@/lib/layout';

export default function FactoryDiagram({ layout }: { layout: FactoryLayout }) {
  const scale = 5; // Pixels per meter
  const padding = 50;

  return (
    <div className="overflow-auto bg-zinc-950 rounded-xl border border-zinc-800 p-8">
      <svg
        width={layout.totalWidth * scale + padding * 2}
        height={layout.totalLength * scale + padding * 2}
        className="mx-auto"
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
          </marker>
        </defs>

        <g transform={`translate(${padding}, ${padding})`}>
          {/* Connections (Belts/Pipes) */}
          {layout.connections.map((conn, i) => {
            const from = layout.elements.find(e => e.id === conn.fromId);
            const to = layout.elements.find(e => e.id === conn.toId);
            if (!from || !to) return null;

            const x1 = (from.x + from.width / 2) * scale;
            const y1 = from.y * scale; // Output is at top for children
            const x2 = (to.x + to.width / 2) * scale;
            const y2 = (to.y + to.length) * scale; // Input is at bottom for parents

            return (
              <g key={`conn-${i}`}>
                <path
                  d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}`}
                  stroke="#3f3f46"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2}
                  fill="#f97316"
                  fontSize="10"
                  textAnchor="middle"
                  className="font-mono font-bold"
                >
                  {conn.amount.toFixed(1)}/m
                </text>
              </g>
            );
          })}

          {/* Machines */}
          {layout.elements.map((el) => (
            <g key={el.id} transform={`translate(${el.x * scale}, ${el.y * scale})`}>
              <rect
                width={el.width * scale}
                height={el.length * scale}
                fill="#27272a"
                stroke="#f97316"
                strokeWidth="2"
                rx="4"
              />
              <text
                x={el.width * scale / 2}
                y={el.length * scale / 2}
                fill="white"
                fontSize="12"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-bold uppercase tracking-tighter"
              >
                {el.name}
              </text>
              <text
                x={el.width * scale / 2}
                y={el.length * scale / 2 + 15}
                fill="#71717a"
                fontSize="8"
                textAnchor="middle"
                className="uppercase font-medium"
              >
                {el.targetItemId}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
