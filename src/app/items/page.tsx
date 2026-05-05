'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Database, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import itemsData from '@/data/items.json';
import ItemImage from '@/components/ItemImage';

export default function ItemsPage() {
  const [search, setSearch] = useState('');

  const filteredItems = itemsData.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  const groups = filteredItems.reduce((acc, item) => {
    const tier = item.tier || 0;
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(item);
    return acc;
  }, {} as Record<number, typeof itemsData>);

  const sortedTiers = Object.keys(groups).map(Number).sort((a, b) => a - b);

  const getPhaseInfo = (tier: number) => {
    if (tier === 0) return { phase: "Alpha", label: "Ressources & Hub" };
    if (tier <= 2) return { phase: "Phase 1", label: "Palier " + tier };
    if (tier <= 4) return { phase: "Phase 2", label: "Palier " + tier };
    if (tier <= 6) return { phase: "Phase 3", label: "Palier " + tier };
    if (tier <= 8) return { phase: "Phase 4", label: "Palier " + tier };
    return { phase: "Phase 5", label: "Palier 9 (Quantum)" };
  };

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-zinc-100">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-2">
                <h1 className="text-5xl font-black uppercase tracking-tighter text-zinc-100 flex items-center gap-4">
                    <Database className="text-orange-500" size={40} />
                    Archives <span className="text-orange-500 italic">Centrales</span>
                </h1>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Indexation complète des composants FICSIT</p>
            </div>

            <div className="relative group w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Rechercher un composant..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:border-orange-500/50 transition-all group-hover:border-zinc-700"
                />
            </div>
        </header>

        {sortedTiers.map((tier, tIdx) => {
          const { phase, label } = getPhaseInfo(tier);
          return (
            <div key={tier} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black bg-orange-500 text-zinc-950 px-2 py-0.5 rounded">{phase}</span>
                    <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] whitespace-nowrap">{label}</h2>
                </div>
                <div className="flex-grow h-px bg-white/5"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {groups[tier].map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 + tIdx * 0.1 }}
                  >
                    <Link
                        href={`/items/${item.id}`}
                        className="flex items-center gap-4 p-4 glass-panel rounded-2xl hover:border-orange-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/[0.02] transition-colors"></div>
                        <ItemImage itemId={item.id} size={48} />
                        <div className="flex-1 min-w-0 relative z-10">
                            <h2 className="font-black text-sm text-zinc-200 group-hover:text-white transition-colors truncate">{item.name}</h2>
                            <p className="text-[10px] text-zinc-500 font-mono truncate uppercase tracking-tighter">{item.nameEn}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={14} className="text-orange-500" />
                        </div>
                    </Link>
                  </motion.div>
                  ))}
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center border border-dashed border-zinc-700">
                    <Search className="text-zinc-700" size={24} />
                </div>
                <p className="text-zinc-500 text-sm uppercase font-black tracking-[0.3em]">Aucune archive correspondante</p>
            </div>
        )}
      </div>
    </div>
  );
}
