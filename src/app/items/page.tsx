'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import itemsData from '@/data/items.json';

export default function ItemsPage() {
  const [search, setSearch] = useState('');

  const filteredItems = itemsData.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  // Group by Tier
  const groups = filteredItems.reduce((acc, item) => {
    const tier = item.tier || 0;
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(item);
    return acc;
  }, {} as Record<number, typeof itemsData>);

  const sortedTiers = Object.keys(groups).map(Number).sort((a, b) => a - b);

  const getTierLabel = (tier: number) => {
    switch(tier) {
        case 0: return "Ressources & Tier 0 (Hub)";
        case 1: case 2: return `Phase 1 - Palier ${tier}`;
        case 3: case 4: return `Phase 2 - Palier ${tier}`;
        case 5: case 6: return `Phase 3 - Palier ${tier}`;
        case 7: case 8: return `Phase 4 - Palier ${tier}`;
        case 9: return "Phase 5 - Palier 9 (Quantum)";
        default: return `Palier ${tier}`;
    }
  };

  return (
    <div className="p-8 bg-zinc-900 min-h-screen text-zinc-100">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
            <Link href="/" className="text-orange-500 hover:underline mb-4 inline-block">← Accueil</Link>
            <h1 className="text-4xl font-bold text-orange-500 uppercase tracking-wider">Base de données des Objets</h1>
        </header>

        <div className="mb-8">
            <input
                type="text"
                placeholder="Rechercher un objet (ex: fer, plaque...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
        </div>

        {sortedTiers.map(tier => (
          <div key={tier} className="mb-12">
            <h2 className="text-2xl font-black text-orange-500/50 mb-6 border-b border-zinc-800 pb-2 uppercase tracking-widest italic">
              {getTierLabel(tier)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups[tier].map((item) => (
                <Link
                    key={item.id}
                    href={`/items/${item.id}`}
                    className="flex items-center gap-4 p-4 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-orange-500 transition-colors group"
                >
                    <div className="w-12 h-12 bg-zinc-900 rounded flex items-center justify-center border border-zinc-700 group-hover:border-orange-900/50">
                        {/* Placeholder icon until real images are provided */}
                        <div className="text-2xl opacity-20 group-hover:opacity-100 transition-opacity">📦</div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="font-bold group-hover:text-orange-400 line-clamp-1">{item.name}</h2>
                                <p className="text-zinc-400 text-xs">{item.nameEn}</p>
                            </div>
                            <span className="bg-zinc-700 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded uppercase">
                                {item.category}
                            </span>
                        </div>
                    </div>
                </Link>
                ))}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
            <p className="text-zinc-500 text-center py-20 uppercase font-bold tracking-widest">Aucun résultat trouvé</p>
        )}
      </div>
    </div>
  );
}
