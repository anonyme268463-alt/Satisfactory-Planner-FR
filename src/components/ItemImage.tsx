'use client';

import React from 'react';
import itemsData from '@/data/items.json';

interface ItemImageProps {
  itemId: string;
  className?: string;
  size?: number;
}

export default function ItemImage({ itemId, className = "", size = 32 }: ItemImageProps) {
  const item = itemsData.find(i => i.id === itemId);

  // In a real app, we'd check if the image exists.
  // For this project, we'll use a placeholder logic.
  const imageUrl = item?.imageUrl || `/images/items/${itemId}.webp`;

  return (
    <div className={`relative flex items-center justify-center bg-zinc-950/50 rounded-lg border border-white/5 overflow-hidden ${className}`} style={{ width: size, height: size }}>
      {/* Fallback pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="pattern-hex" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M5 0L10 2.5V7.5L5 10L0 7.5V2.5L5 0Z" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#pattern-hex)" />
        </svg>
      </div>

      {/*
          Since we don't have the actual webp files in the public folder yet,
          we'll show a high-styled icon or character.
      */}
      <div className="relative z-10 text-xl group-hover:scale-110 transition-transform duration-500">
        {item?.isFluid ? '💧' : '📦'}
      </div>

      {/*
          Actual image would be:
          <img
            src={imageUrl}
            alt={item?.name}
            className="w-full h-full object-contain p-1"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
      */}
    </div>
  );
}
