'use client';

import React, { useState } from 'react';
import generatorsData from '@/data/generators.json';
import Link from 'next/link';

export default function PowerPlanner() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [selectedFuels, setSelectedFuels] = useState<Record<string, string>>({});
  const [targetConsumption, setTargetConsumption] = useState(100);

  const totalProduction = Object.entries(counts).reduce((acc, [id, count]) => {
    const gen = (generatorsData as any[]).find(g => g.id === id);
    return acc + (gen?.powerProduction || 0) * count;
  }, 0);

  const resourceNeeds = Object.entries(counts).reduce((acc, [id, count]) => {
    if (count <= 0) return acc;
    const gen = (generatorsData as any[]).find(g => g.id === id);
    if (!gen) return acc;

    if (gen.waterRate) {
        acc['water'] = (acc['water'] || 0) + gen.waterRate * count;
    }

    if (gen.fuels && gen.fuels.length > 0) {
        const fuelId = selectedFuels[id] || gen.fuels[0].itemId;
        const fuel = gen.fuels.find((f: any) => f.itemId === fuelId);
        if (fuel) {
            acc[fuelId] = (acc[fuelId] || 0) + fuel.rate * count;
        }
    }

    return acc;
  }, {} as Record<string, number>);

  const balance = totalProduction - targetConsumption;

  return (
    <div className="p-8 bg-zinc-900 min-h-screen text-zinc-100">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-16">
            <h1 className="text-5xl font-black text-orange-500 uppercase tracking-tighter flex items-center gap-4 italic">
                <span className="bg-orange-500 text-zinc-950 px-3 py-1 rounded-sm not-italic">E</span>
                Energy Center
            </h1>
            <nav className="flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
                <Link href="/items" className="hover:text-orange-500 transition-colors py-2 border-b-2 border-transparent hover:border-orange-500">Objets</Link>
                <Link href="/recipes" className="hover:text-orange-500 transition-colors py-2 border-b-2 border-transparent hover:border-orange-500">Recettes</Link>
                <Link href="/planner" className="hover:text-orange-500 transition-colors py-2 border-b-2 border-transparent hover:border-orange-500">Planificateur</Link>
                <Link href="/power" className="text-orange-500 py-2 border-b-2 border-orange-500">Énergie</Link>
            </nav>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6 bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-xl">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    Unités de Production
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatorsData.map(gen => (
                        <div key={gen.id} className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 hover:border-orange-500/50 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-black text-lg tracking-tight">{gen.name}</p>
                                    <p className="text-[10px] text-zinc-500 font-mono uppercase">{gen.powerProduction} MW UNITAIRE</p>
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    value={counts[gen.id] || 0}
                                    onChange={(e) => setCounts({...counts, [gen.id]: Math.max(0, Number(e.target.value))})}
                                    className="w-20 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-center font-mono font-black text-orange-500 focus:border-orange-500 outline-none"
                                />
                            </div>

                            {(gen as any).fuels && (gen as any).fuels.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-[9px] text-zinc-600 uppercase font-black">Combustible</label>
                                    <select
                                        value={selectedFuels[gen.id] || (gen as any).fuels[0].itemId}
                                        onChange={(e) => setSelectedFuels({...selectedFuels, [gen.id]: e.target.value})}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-400 font-bold focus:border-orange-500 outline-none"
                                    >
                                        {(gen as any).fuels.map((f: any) => (
                                            <option key={f.itemId} value={f.itemId}>{f.itemId.replace(/-/g, ' ').toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-8">
                <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-xl space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-4">Analyse du Réseau</h2>

                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Charge Demandée (MW)</label>
                        <input
                            type="number"
                            value={targetConsumption}
                            onChange={(e) => setTargetConsumption(Number(e.target.value))}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-2xl font-mono text-orange-500 focus:border-orange-500 outline-none font-black"
                        />
                    </div>

                    <div className={`p-6 rounded-2xl border ${balance >= 0 ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${balance >= 0 ? 'bg-green-500 text-zinc-950' : 'bg-red-500 text-white animate-pulse'}`}>
                                {balance >= 0 ? 'Stable' : 'Critique'}
                            </span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-baseline">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Production Totale</span>
                                <span className="text-2xl font-black font-mono text-green-500">{totalProduction} <small className="text-[10px]">MW</small></span>
                            </div>
                            <div className="flex justify-between items-baseline border-t border-zinc-800 pt-4">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Bilan Réseau</span>
                                <span className={`text-2xl font-black font-mono ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {balance > 0 ? '+' : ''}{balance.toFixed(1)} <small className="text-[10px]">MW</small>
                                </span>
                            </div>
                        </div>
                    </div>

                    {Object.keys(resourceNeeds).length > 0 && (
                        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 text-center border-b border-zinc-800 pb-2">Ressources Requises</h3>
                            <div className="space-y-3">
                                {Object.entries(resourceNeeds).map(([id, rate]) => (
                                    <div key={id} className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">{id.replace(/-/g, ' ')}</span>
                                        <span className="text-sm text-orange-400 font-black font-mono">{rate.toFixed(2)}<small className="text-[8px] ml-1 text-zinc-600">/min</small></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
