'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import recipesData from '@/data/recipes.json';
import itemsData from '@/data/items.json';
import machinesData from '@/data/machines.json';
import ItemImage from '@/components/ItemImage';
import { Search, FlaskConical, Cpu, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecipesPage() {
  const [search, setSearch] = useState('');

  const filteredRecipes = recipesData.filter(recipe =>
    recipe.name.toLowerCase().includes(search.toLowerCase()) ||
    recipe.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-zinc-100">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-2">
                <h1 className="text-5xl font-black uppercase tracking-tighter text-zinc-100 flex items-center gap-4">
                    <FlaskConical className="text-orange-500" size={40} />
                    Protocoles de <span className="text-orange-500 italic">Synthèse</span>
                </h1>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Optimisation des processus de transformation atomique</p>
            </div>

            <div className="relative group w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Rechercher une recette..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:border-orange-500/50 transition-all group-hover:border-zinc-700"
                />
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {filteredRecipes.map((recipe, i) => {
                const machine = machinesData.find(m => m.id === recipe.producedIn);
                const mainProduct = recipe.products[0];
                return (
                    <motion.div
                        key={recipe.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: Math.min(i * 0.01, 0.5) }}
                    >
                        <Link
                            href={`/recipes/${recipe.id}`}
                            className="block glass-panel rounded-3xl p-6 hover:border-orange-500/30 transition-all group relative overflow-hidden h-full"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <ItemImage itemId={mainProduct.itemId} size={48} />
                                    <div>
                                        <h2 className="font-black text-zinc-100 group-hover:text-orange-500 transition-colors leading-tight">{recipe.name}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            {recipe.isAlternate && <span className="text-[8px] font-black bg-orange-500 text-zinc-950 px-1.5 py-0.5 rounded">ALT</span>}
                                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{machine?.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-black text-orange-500 font-mono">{mainProduct.amount}/min</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Ingrédients</p>
                                <div className="flex flex-wrap gap-2">
                                    {recipe.ingredients.map(ing => (
                                        <div key={ing.itemId} className="flex items-center gap-2 bg-zinc-950/50 px-2 py-1 rounded-lg border border-white/5">
                                            <ItemImage itemId={ing.itemId} size={16} />
                                            <span className="text-[10px] font-black text-zinc-400">{ing.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase">
                                    <Zap size={10} className="text-orange-500" /> {machine?.powerConsumption} MW
                                </div>
                                <ChevronRight size={14} className="text-zinc-700 group-hover:text-orange-500 transition-colors" />
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </div>

        {filteredRecipes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center border border-dashed border-zinc-700">
                    <FlaskConical className="text-zinc-700" size={24} />
                </div>
                <p className="text-zinc-500 text-sm uppercase font-black tracking-[0.3em]">Aucun protocole détecté</p>
            </div>
        )}
      </div>
    </div>
  );
}
