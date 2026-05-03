'use client';

import React, { useState, useMemo } from 'react';
import itemsData from '@/data/items.json';
import recipesData from '@/data/recipes.json';
import machinesData from '@/data/machines.json';
import { solveProduction, ProductionStep } from '@/lib/solver';
import Link from 'next/link';

function StepCard({
  step,
  onOverclockChange,
  onRecipeChange
}: {
  step: ProductionStep,
  onOverclockChange: (recipeId: string, value: number) => void,
  onRecipeChange: (itemId: string, recipeId: string) => void
}) {
  const item = itemsData.find(i => i.id === step.targetItemId);
  const recipe = recipesData.find(r => r.id === step.recipeId);
  const machine = machinesData.find(m => m.id === step.machineId);

  const alternativeRecipes = recipesData.filter(r =>
    r.products.some(p => p.itemId === step.targetItemId)
  );

  return (
    <div className="border-l-2 border-orange-500/30 pl-6 ml-2 space-y-4">
      <div className="bg-zinc-700/50 p-4 rounded-lg border border-zinc-600 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-lg">{item?.name}</h4>
            <p className="text-sm text-zinc-400 font-mono">{step.targetAmount.toFixed(2)} / min</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 uppercase tracking-tighter">Machine</p>
            <p className="font-bold text-orange-400">{step.machineCount.toFixed(2)}x {machine?.name}</p>
            <p className="text-[10px] text-zinc-500">{step.powerConsumption.toFixed(2)} MW</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 items-center">
           <div className="flex items-center gap-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Recette:</label>
              <select
                value={step.recipeId}
                onChange={(e) => onRecipeChange(step.targetItemId, e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded px-1 py-0.5 text-[10px] text-zinc-300 focus:border-orange-500 outline-none"
              >
                {alternativeRecipes.map(r => (
                  <option key={r.id} value={r.id}>{r.name}{r.isAlternate ? ' (Alt)' : ''}</option>
                ))}
              </select>
           </div>
           <div className="flex items-center gap-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Surcadencage:</label>
              <input
                type="number"
                min="1"
                max="250"
                value={step.overclock}
                onChange={(e) => onOverclockChange(step.recipeId, Number(e.target.value))}
                className="bg-zinc-900 border border-zinc-700 rounded px-1 py-0.5 text-[10px] w-12 font-mono text-orange-500"
              />
              <span className="text-[10px] text-zinc-500">%</span>
           </div>
        </div>
      </div>

      {step.childSteps.length > 0 && (
        <div className="space-y-4 mt-4">
          {step.childSteps.map((child, i) => (
            <StepCard
              key={`${child.targetItemId}-${i}`}
              step={child}
              onOverclockChange={onOverclockChange}
              onRecipeChange={onRecipeChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductionPlanner() {
  const [targetItemId, setTargetItemId] = useState(itemsData.find(i => i.category !== 'Resource')?.id || '');
  const [targetAmount, setTargetAmount] = useState(10);
  const [overclock, setOverclock] = useState<Record<string, number>>({});
  const [preferredRecipes, setPreferredRecipes] = useState<Record<string, string>>({});

  const plan = useMemo(() => {
    if (!targetItemId) return null;
    return solveProduction(targetItemId, targetAmount, { overclock, preferredRecipes });
  }, [targetItemId, targetAmount, overclock, preferredRecipes]);

  const handleOverclockChange = (recipeId: string, value: number) => {
    setOverclock(prev => ({ ...prev, [recipeId]: value }));
  };

  const handleRecipeChange = (itemId: string, recipeId: string) => {
    setPreferredRecipes(prev => ({ ...prev, [itemId]: recipeId }));
  };

  return (
    <div className="p-8 bg-zinc-900 min-h-screen text-zinc-100">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-black text-orange-500 uppercase tracking-tighter flex items-center gap-3">
                <span className="bg-orange-500 text-zinc-900 px-2 py-1 rounded">S</span>
                Satisfactory Planner FR
            </h1>
            <nav className="flex gap-6 text-sm font-bold uppercase tracking-widest text-zinc-400">
                <Link href="/items" className="hover:text-orange-500 transition-colors">Objets</Link>
                <Link href="/recipes" className="hover:text-orange-500 transition-colors">Recettes</Link>
                <Link href="/planner" className="text-orange-500">Planificateur</Link>
            </nav>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar: Controls */}
          <div className="lg:col-span-1 space-y-6 bg-zinc-800 p-6 rounded-xl border border-zinc-700 h-fit sticky top-8">
            <div>
              <label className="block text-sm font-bold text-zinc-500 mb-2 uppercase tracking-widest">Produit Cible</label>
              <select
                value={targetItemId}
                onChange={(e) => setTargetItemId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none"
              >
                {itemsData.filter(i => i.category !== 'Resource').map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-500 mb-2 uppercase tracking-widest">Taux (u/min)</label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 text-white font-mono focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="pt-6 border-t border-zinc-700 space-y-4">
              <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em]">Tableau de Bord</h3>
              {plan && (
                <div className="space-y-4">
                  <div className="bg-zinc-900/50 p-4 rounded border border-zinc-700">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold mb-1">Énergie Totale</span>
                    <span className="text-2xl font-mono text-orange-400 font-bold">{plan.totalPower.toFixed(1)} <small className="text-xs text-zinc-500">MW</small></span>
                  </div>

                  <div className="bg-zinc-900/50 p-4 rounded border border-zinc-700">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold mb-2">Ressources Brutes</span>
                    <div className="space-y-2">
                        {Object.entries(plan.rawResources).map(([id, amount]) => (
                        <div key={id} className="flex justify-between items-center text-xs font-mono">
                            <span className="text-zinc-400">{itemsData.find(i => i.id === id)?.name || id}:</span>
                            <span className="text-green-400 font-bold">{amount.toFixed(1)}</span>
                        </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main: Visualization */}
          <div className="lg:col-span-3 space-y-8">
             <div className="flex items-center gap-4 mb-4">
                <div className="h-[2px] flex-grow bg-zinc-800"></div>
                <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Arbre de Fabrication</h2>
                <div className="h-[2px] flex-grow bg-zinc-800"></div>
             </div>

             {plan && plan.steps.length > 0 ? (
               <div className="space-y-8">
                 {plan.steps.map((step, i) => (
                   <StepCard
                    key={`${step.targetItemId}-${i}`}
                    step={step}
                    onOverclockChange={handleOverclockChange}
                    onRecipeChange={handleRecipeChange}
                  />
                 ))}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-20 text-zinc-600 border-2 border-dashed border-zinc-800 rounded-2xl">
                  <p className="uppercase font-bold tracking-widest">Aucune donnée disponible</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
