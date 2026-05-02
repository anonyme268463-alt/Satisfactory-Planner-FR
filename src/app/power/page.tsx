'use client';

import React, { useState } from 'react';
import generatorsData from '@/data/generators.json';
import Link from 'next/link';

export default function PowerPlanner() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [targetConsumption, setTargetConsumption] = useState(100);

  const totalProduction = Object.entries(counts).reduce((acc, [id, count]) => {
    const gen = generatorsData.find(g => g.id === id);
    return acc + (gen?.powerProduction || 0) * count;
  }, 0);

  const balance = totalProduction - targetConsumption;

  return (
    <div className="p-8 bg-zinc-900 min-h-screen text-zinc-100">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-black text-orange-500 uppercase tracking-tighter flex items-center gap-3">
                <span className="bg-orange-500 text-zinc-900 px-2 py-1 rounded">E</span>
                Power Planner
            </h1>
            <nav className="flex gap-6 text-sm font-bold uppercase tracking-widest text-zinc-400">
                <Link href="/planner" className="hover:text-orange-500 transition-colors">Planificateur</Link>
                <Link href="/power" className="text-orange-500">Énergie</Link>
            </nav>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 bg-zinc-800 p-6 rounded-xl border border-zinc-700">
                <h2 className="text-xl font-bold uppercase text-zinc-400 mb-4">Générateurs</h2>
                {generatorsData.map(gen => (
                    <div key={gen.id} className="flex justify-between items-center bg-zinc-900 p-4 rounded border border-zinc-700">
                        <div>
                            <p className="font-bold">{gen.name}</p>
                            <p className="text-xs text-zinc-500">{gen.powerProduction} MW chacun</p>
                        </div>
                        <input
                            type="number"
                            min="0"
                            value={counts[gen.id] || 0}
                            onChange={(e) => setCounts({...counts, [gen.id]: Number(e.target.value)})}
                            className="w-20 bg-zinc-800 border border-zinc-600 rounded p-2 text-center font-mono focus:border-orange-500 outline-none"
                        />
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700">
                    <h2 className="text-xl font-bold uppercase text-zinc-400 mb-4">Consommation Cible</h2>
                    <input
                        type="number"
                        value={targetConsumption}
                        onChange={(e) => setTargetConsumption(Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded p-4 text-2xl font-mono text-orange-400 focus:border-orange-500 outline-none"
                    />
                    <p className="text-xs text-zinc-500 mt-2 uppercase tracking-widest">Valeur en MW</p>
                </div>

                <div className={`p-6 rounded-xl border ${balance >= 0 ? 'bg-green-900/20 border-green-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
                    <h2 className="text-sm font-bold uppercase text-zinc-400 mb-2">Bilan Énergétique</h2>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs text-zinc-500 uppercase">Production</p>
                            <p className="text-2xl font-mono font-bold text-green-400">{totalProduction} MW</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-zinc-500 uppercase">Différence</p>
                            <p className={`text-2xl font-mono font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {balance > 0 ? '+' : ''}{balance.toFixed(1)} MW
                            </p>
                        </div>
                    </div>
                    {balance < 0 && (
                        <div className="mt-4 p-2 bg-red-500 text-white text-[10px] font-black uppercase text-center rounded animate-pulse">
                            Avertissement: Production Insuffisante
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
