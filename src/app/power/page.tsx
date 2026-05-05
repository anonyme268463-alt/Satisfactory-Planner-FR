'use client';

import React, { useState } from 'react';
import generatorsData from '@/data/generators.json';
import itemsData from '@/data/items.json';
import { Zap, Fuel, Droplet, Wind, Info, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemImage from '@/components/ItemImage';

export default function PowerPage() {
  const [grid, setGrid] = useState<Array<{ id: string, count: number }>>([
    { id: 'coal-generator', count: 8 },
    { id: 'fuel-generator', count: 0 }
  ]);

  const totalPower = grid.reduce((acc, entry) => {
    const gen = generatorsData.find(g => g.id === entry.id);
    return acc + (gen?.powerProduction || 0) * entry.count;
  }, 0);

  const updateCount = (id: string, count: number) => {
    setGrid(prev => prev.map(item => item.id === id ? { ...item, count: Math.max(0, count) } : item));
  };

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-zinc-100 pb-32">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
            <div className="space-y-2">
                <h1 className="text-5xl font-black uppercase tracking-tighter text-zinc-100 flex items-center gap-4">
                    <Zap className="text-orange-500" size={40} />
                    Grille <span className="text-orange-500 italic">Énergétique</span>
                </h1>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Gestion des flux de puissance et charges thermiques</p>
            </div>

            <div className="glass-panel px-8 py-4 rounded-3xl border-orange-500/20 text-right">
                <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">Production Totale</p>
                <p className="text-4xl font-black text-white tracking-tighter">{totalPower.toLocaleString()} <small className="text-sm text-zinc-500 font-mono">MW</small></p>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] italic">Unités de Production</h2>
                    <div className="flex-grow h-px bg-white/5"></div>
                </div>

                <div className="space-y-4">
                    {generatorsData.map((gen, i) => {
                        const entry = grid.find(e => e.id === gen.id) || { count: 0 };
                        return (
                            <motion.div
                                key={gen.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-white/20 transition-all duration-500"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-zinc-950/50 rounded-2xl flex items-center justify-center border border-white/5 text-orange-500 group-hover:scale-110 transition-transform duration-500">
                                        {gen.id.includes('coal') ? <Wind size={24} /> : <Zap size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white leading-tight">{gen.name}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-black text-orange-500 uppercase">{gen.powerProduction} MW / Unité</span>
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{gen.nameEn}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Capacité</p>
                                        <p className="text-xl font-black text-white">{(gen.powerProduction * entry.count).toLocaleString()} <small className="text-[10px] text-zinc-500">MW</small></p>
                                    </div>

                                    <div className="flex items-center gap-3 bg-zinc-950/50 px-4 py-2 rounded-2xl border border-white/5">
                                        <button
                                            onClick={() => updateCount(gen.id, entry.count - 1)}
                                            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all"
                                        >-</button>
                                        <input
                                            type="number" value={entry.count} onChange={(e) => updateCount(gen.id, Number(e.target.value))}
                                            className="w-12 bg-transparent text-center font-black text-orange-500 focus:outline-none"
                                        />
                                        <button
                                            onClick={() => updateCount(gen.id, entry.count + 1)}
                                            className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-zinc-950 transition-all"
                                        >+</button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] italic">Besoins en Carburant</h2>
                    <div className="flex-grow h-px bg-white/5"></div>
                </div>

                <div className="glass-panel rounded-3xl p-8 space-y-8">
                    {grid.filter(e => e.count > 0).map(entry => {
                        const gen = generatorsData.find(g => g.id === entry.id)!;
                        return (
                            <div key={entry.id} className="space-y-4">
                                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Fuel size={12} className="text-orange-500" /> {gen.name}
                                </h4>
                                <div className="space-y-2">
                                    {gen.fuels.map(fuel => (
                                        <div key={fuel.itemId} className="flex justify-between items-center bg-zinc-950/30 p-3 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <ItemImage itemId={fuel.itemId} size={24} />
                                                <span className="text-[11px] font-bold text-zinc-300">{itemsData.find(it => it.id === fuel.itemId)?.name}</span>
                                            </div>
                                            <span className="text-xs font-black text-orange-500 font-mono">{(fuel.rate * entry.count).toFixed(1)}/m</span>
                                        </div>
                                    ))}
                                    {gen.waterRate && (
                                        <div className="flex justify-between items-center bg-blue-500/5 p-3 rounded-xl border border-blue-500/10">
                                            <div className="flex items-center gap-3 text-blue-500">
                                                <Droplet size={14} />
                                                <span className="text-[11px] font-bold">Eau</span>
                                            </div>
                                            <span className="text-xs font-black text-blue-500 font-mono">{(gen.waterRate * entry.count).toFixed(1)}/m</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {grid.every(e => e.count === 0) && (
                        <div className="py-20 text-center space-y-4">
                            <Trash2 size={40} className="mx-auto text-zinc-800" />
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-relaxed">Aucun générateur actif sur le réseau.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
