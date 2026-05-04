'use client';

import React, { useState, useMemo } from 'react';
import itemsData from '@/data/items.json';
import recipesData from '@/data/recipes.json';
import machinesData from '@/data/machines.json';
import { solveProduction, ProductionStep } from '@/lib/solver';
import { generateLayout } from '@/lib/layout';
import Link from 'next/link';
import FactoryDiagram from '@/components/FactoryDiagram';
import Combobox from '@/components/Combobox';

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
    <div className="border-l-2 border-orange-500/20 pl-6 ml-2 space-y-4">
      <div className="bg-zinc-800/40 p-5 rounded-xl border border-zinc-700/50 backdrop-blur-sm relative overflow-hidden group hover:border-orange-500/50 transition-all duration-300">
        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]"></div>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-700/50 shadow-inner shrink-0">
                {/* Real icon: <img src={item?.imageUrl} alt="" className="w-8 h-8 opacity-90" /> */}
                <div className="text-2xl opacity-20">📦</div>
            </div>
            <div>
              <h4 className="font-black text-xl tracking-tight">{item?.name}</h4>
              <p className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                  {step.targetAmount.toFixed(2)} UNITÉS / MIN
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Infrastructure</p>
            <p className="font-black text-orange-400 text-lg leading-none">{step.machineCount.toFixed(2)}x <span className="text-zinc-200">{machine?.name}</span></p>
            <p className="text-[10px] text-zinc-500 font-mono mt-1 italic">{step.powerConsumption.toFixed(2)} MW REQUIS</p>
          </div>
        </div>

        {step.products.length > 1 && (
          <div className="mt-4 pt-4 border-t border-zinc-700/30">
            <p className="text-[9px] text-zinc-500 uppercase font-black tracking-tighter mb-2">Coproduits / Sous-produits</p>
            <div className="flex flex-wrap gap-3">
              {step.products.filter(p => p.itemId !== step.targetItemId).map(p => (
                <div key={p.itemId} className="bg-zinc-900/50 px-2 py-1 rounded border border-zinc-800 flex items-center gap-2">
                  <span className="text-[10px] text-zinc-300 font-bold">{itemsData.find(i => i.id === p.itemId)?.name}</span>
                  <span className="text-[10px] text-orange-500 font-mono font-black">{p.amount.toFixed(2)} / min</span>
                  <div className="flex gap-1 ml-2 border-l border-zinc-700 pl-2">
                    {p.itemId === 'water' && <span className="text-[8px] text-blue-400 uppercase font-black tracking-tighter">Réinjecter / Jeter</span>}
                    {p.itemId === 'heavy-oil-residue' && <span className="text-[8px] text-purple-400 uppercase font-black tracking-tighter">Cokéifier / Brûler</span>}
                    {p.itemId === 'polymer-resin' && <span className="text-[8px] text-pink-400 uppercase font-black tracking-tighter">Plastique / Caoutchouc</span>}
                    {p.itemId === 'silica' && <span className="text-[8px] text-zinc-400 uppercase font-black tracking-tighter">Béton / Verre / Boucle</span>}
                    {p.itemId === 'sulfuric-acid' && <span className="text-[8px] text-yellow-400 uppercase font-black tracking-tighter">Boucle Uranium</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-4">
            <div className="flex flex-col">
                <span className="text-[8px] text-zinc-500 uppercase font-black">Logistique Entrée</span>
                <div className="flex gap-1 mt-1">
                    {step.ingredients.map(ing => {
                        const item = itemsData.find(i => i.id === ing.itemId);
                        const isFluid = item?.isFluid;
                        const amount = ing.amount;
                        let tier = "";
                        if (isFluid) {
                            tier = amount <= 300 ? "Pipe Mk1" : "Pipe Mk2";
                        } else {
                            if (amount <= 60) tier = "Mk1";
                            else if (amount <= 120) tier = "Mk2";
                            else if (amount <= 270) tier = "Mk3";
                            else if (amount <= 480) tier = "Mk4";
                            else if (amount <= 780) tier = "Mk5";
                            else tier = "Mk6";
                        }
                        return (
                            <div key={ing.itemId} className="text-[9px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 font-mono">
                                {item?.name}: <span className="text-orange-400">{tier}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-6 items-center pt-4 border-t border-zinc-700/50">
           <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-zinc-500 uppercase font-black tracking-tighter">Configuration Recette</label>
              <select
                value={step.recipeId}
                onChange={(e) => onRecipeChange(step.targetItemId, e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-300 focus:border-orange-500 outline-none font-bold"
              >
                {alternativeRecipes.map(r => (
                  <option key={r.id} value={r.id}>{r.name}{r.isAlternate ? ' (Alternative)' : ''}</option>
                ))}
              </select>
           </div>

           <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-zinc-500 uppercase font-black tracking-tighter">Fréquence Cadence</label>
              <div className="flex items-center gap-2">
                <input
                    type="range"
                    min="1"
                    max="250"
                    step="1"
                    value={step.overclock}
                    onChange={(e) => onOverclockChange(step.recipeId, Number(e.target.value))}
                    className="w-24 accent-orange-500"
                />
                <div className="flex items-center bg-zinc-900 px-2 py-1 rounded border border-zinc-700">
                    <input
                        type="number"
                        min="1"
                        max="250"
                        value={step.overclock}
                        onChange={(e) => onOverclockChange(step.recipeId, Number(e.target.value))}
                        className="bg-transparent text-[10px] w-8 font-mono text-orange-500 font-bold focus:outline-none"
                    />
                    <span className="text-[10px] text-zinc-500 font-bold">%</span>
                </div>
              </div>
           </div>
        </div>
      </div>

      {step.childSteps.length > 0 && (
        <div className="space-y-6 mt-6">
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
  const [strategy, setStrategy] = useState<'default' | 'min-energy'>('default');
  const [view, setView] = useState<'tree' | 'layout'>('tree');

  const plan = useMemo(() => {
    if (!targetItemId) return null;
    return solveProduction(targetItemId, targetAmount, { overclock, preferredRecipes, strategy });
  }, [targetItemId, targetAmount, overclock, preferredRecipes, strategy]);

  const layout = useMemo(() => {
    if (!plan || plan.steps.length === 0) return null;
    return generateLayout(plan.steps);
  }, [plan]);

  const handleOverclockChange = (recipeId: string, value: number) => {
    setOverclock(prev => ({ ...prev, [recipeId]: value }));
  };

  const handleRecipeChange = (itemId: string, recipeId: string) => {
    setPreferredRecipes(prev => ({ ...prev, [itemId]: recipeId }));
  };

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-zinc-100 font-sans selection:bg-orange-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <h1 className="text-5xl font-black text-orange-500 uppercase tracking-tighter flex items-center gap-4 italic">
                <span className="bg-orange-500 text-zinc-950 px-3 py-1 rounded-sm not-italic">S</span>
                Satisfactory Planner
            </h1>
            <nav className="flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
                <Link href="/items" className="hover:text-orange-500 transition-colors py-2 border-b-2 border-transparent hover:border-orange-500">Objets</Link>
                <Link href="/recipes" className="hover:text-orange-500 transition-colors py-2 border-b-2 border-transparent hover:border-orange-500">Recettes</Link>
                <Link href="/planner" className="text-orange-500 py-2 border-b-2 border-orange-500">Planificateur</Link>
                <Link href="/power" className="hover:text-orange-500 transition-colors py-2 border-b-2 border-transparent hover:border-orange-500">Énergie</Link>
            </nav>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar: Controls */}
          <div className="lg:col-span-1 space-y-8 bg-zinc-900 p-8 rounded-2xl border border-zinc-800 h-fit sticky top-8 shadow-xl">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Module de Cible</label>
              <div className="relative group">
                <Combobox
                  options={itemsData.filter(i => i.category !== 'Resource').map(i => ({ id: i.id, name: i.name }))}
                  value={targetItemId}
                  onChange={setTargetItemId}
                  placeholder="Sélectionner un produit..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Stratégie Optim.</label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-black text-orange-500 uppercase tracking-widest focus:border-orange-500 outline-none"
              >
                <option value="default">Par Défaut (Standard)</option>
                <option value="min-energy">Énergie Minimale</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Débit Souhaité</label>
              <div className="relative group">
                <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-mono focus:outline-none focus:border-orange-500 transition-all font-black text-xl group-hover:border-zinc-700"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-600 uppercase">u/min</span>
              </div>
            </div>

            <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800 shadow-inner">
                <button
                    onClick={() => setView('tree')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${view === 'tree' ? 'bg-orange-500 text-zinc-950 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    Analyse Arbre
                </button>
                <button
                    onClick={() => setView('layout')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${view === 'layout' ? 'bg-orange-500 text-zinc-950 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    Plan Technique
                </button>
            </div>

            <div className="pt-8 border-t border-zinc-800 space-y-6">
              <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] flex items-center gap-2">
                  <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                  Rapport de Production
              </h3>
              {plan && (
                <div className="space-y-6">
                  <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 rounded-full -mr-8 -mt-8"></div>
                    <span className="text-[9px] text-zinc-500 block uppercase font-black mb-1 tracking-widest italic">Puissance Estimée</span>
                    <span className="text-3xl font-black text-orange-500 font-mono tracking-tighter">{plan.totalPower.toFixed(1)} <small className="text-xs text-zinc-600">MW</small></span>
                  </div>

                  <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800">
                    <span className="text-[9px] text-zinc-500 block uppercase font-black mb-3 tracking-widest italic text-center border-b border-zinc-800 pb-2">Matériaux d'Entrée</span>
                    <div className="space-y-3">
                        {Object.entries(plan.rawResources).map(([id, amount]) => (
                        <div key={id} className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">{itemsData.find(i => i.id === id)?.name || id}</span>
                            <span className="text-sm text-green-500 font-black font-mono">{amount.toFixed(1)}</span>
                        </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main: Visualization */}
          <div className="lg:col-span-3 space-y-12">
             {view === 'tree' ? (
               <>
                <div className="flex items-center gap-6">
                    <h2 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.5em] whitespace-nowrap italic">Logistique de Fabrication</h2>
                    <div className="h-px flex-grow bg-gradient-to-r from-zinc-800 to-transparent"></div>
                </div>

                {plan && plan.steps.length > 0 ? (
                <div className="space-y-10 pb-20">
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
                <div className="flex flex-col items-center justify-center py-32 text-zinc-700 border-2 border-dashed border-zinc-900 rounded-3xl group hover:border-orange-500/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <p className="uppercase font-black tracking-[0.3em] text-xs">Awaiting data input...</p>
                </div>
                )}
               </>
             ) : (
                <>
                <div className="flex items-center gap-6 mb-8">
                    <h2 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.5em] whitespace-nowrap italic">Schématique du Site</h2>
                    <div className="h-px flex-grow bg-gradient-to-r from-zinc-800 to-transparent"></div>
                </div>
                {layout ? (
                    <div className="pb-20">
                        <FactoryDiagram layout={layout} />
                    </div>
                ) : (
                    <p className="text-center text-zinc-700 py-32 italic uppercase font-black tracking-widest text-[10px]">No active site layout generated.</p>
                )}
                </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
