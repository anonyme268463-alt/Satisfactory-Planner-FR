'use client';

import React from 'react';
import itemsData from '@/data/items.json';
import { getAssetPath } from '@/lib/assets';

interface ItemImageProps {
  itemId: string;
  className?: string;
  size?: number;
}

export default function ItemImage({ itemId, className = "", size = 32 }: ItemImageProps) {
  const item = itemsData.find(i => i.id === itemId);

  // Try to format the ID for external CDNs (e.g., iron-ingot -> IronIngot)
  const camelCaseId = itemId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');

  const localUrl = getAssetPath(item?.imageUrl || `/images/items/${itemId}.webp`);
  const [currentSrc, setCurrentSrc] = React.useState(localUrl);
  const [fallbackAttempted, setFallbackAttempted] = React.useState(false);

  const getCategoryColor = () => {
    if (item?.isFluid) return '#06b6d4';
    switch (item?.category) {
      case 'Resource': return '#3b82f6';
      case 'Component':
      case 'Parts':
        return '#f26419';
      case 'Equipment': return '#8b5cf6';
      case 'Consumable': return '#22c55e';
      default: return '#71717a';
    }
  };

  const getCategoryIcon = () => {
    if (item?.isFluid) {
      return (
        <path d="M12 21.5c-4.4 0-8-3.6-8-8 0-4.4 8-12 8-12s8 7.6 8 12c0 4.4-3.6 8-8 8zM12 17c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z" />
      );
    }

    switch (item?.category) {
      case 'Resource':
        return (
          <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 15.5l-6-3.7V8.2l6 3.7 6-3.7v5.6l-6 3.7z" />
        );
      case 'Component':
      case 'Parts':
        return (
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        );
      default:
        return (
          <>
            <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </>
        );
    }
  };

  const color = getCategoryColor();

  return (
    <div className={`relative flex items-center justify-center bg-zinc-950 rounded-lg border border-white/10 overflow-hidden group/item ${className}`} style={{ width: size, height: size }}>
      {/* Technical Background */}
      <div className="absolute inset-0 z-0 bg-zinc-900 overflow-hidden opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${color}22 0%, transparent 70%)`
        }}></div>
        <div className="absolute inset-0 scanline-subtle"></div>
      </div>

      {/* Fallback SVG Icon */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-2 opacity-30 group-hover/item:opacity-60 transition-opacity">
        <svg viewBox="0 0 24 24" className="w-full h-full" style={{ color }} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {getCategoryIcon()}
        </svg>
      </div>

      <img
        src={currentSrc}
        alt={item?.name}
        className={`relative z-20 w-full h-full object-contain p-1.5 transition-all duration-500 group-hover/item:scale-110 group-hover/item:rotate-3 group-hover/item:brightness-110 ${!currentSrc ? 'opacity-0' : 'opacity-100'}`}
        onError={() => {
          if (!fallbackAttempted) {
            setFallbackAttempted(true);
            // Fallback to a community CDN (Satisfactory Calculator format)
            setCurrentSrc(`https://satisfactory-calculator.com/img/items/game/${camelCaseId}.png`);
          } else {
            setCurrentSrc('');
          }
        }}
      />

      {/* FICSIT Industrial Frame Elements */}
      <div className="absolute top-0 left-0 w-full h-full border border-white/5 pointer-events-none z-30"></div>
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-orange-500/50 z-30"></div>
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-orange-500/50 z-30"></div>

      {/* Category Tag (only visible if size is large enough) */}
      {size > 48 && item?.category && (
        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 z-40">
          <div className="px-1 py-px bg-zinc-900/80 backdrop-blur-sm border border-white/10 rounded-[2px] text-[6px] font-black uppercase tracking-tighter text-zinc-400 group-hover/item:text-white transition-colors">
            {item.category}
          </div>
        </div>
      )}

      {/* Item Type Indicator Corner */}
      <div className="absolute top-0 right-0 z-40">
        <div className="w-2 h-2 overflow-hidden">
          <div className="absolute top-[-4px] right-[-4px] w-8 h-8 rotate-45" style={{ backgroundColor: `${color}44` }}></div>
        </div>
      </div>
    </div>
  );
}
