'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Zap, Package, ChevronRight, Info, Activity, Layers, Map as MapIcon, ClipboardList } from 'lucide-react';
import itemsData from '@/data/items.json';
import recipesData from '@/data/recipes.json';
import machinesData from '@/data/machines.json';
import { solveProduction, ProductionStep } from '@/lib/solver';
import { generateLayout } from '@/lib/layout';
import Combobox from '@/components/Combobox';
import ItemImage from '@/components/ItemImage';
import FactoryDiagram from '@/components/FactoryDiagram';

function StepCard({
  step,
  depth = 0,
  onOverclockChange,
  onRecipeChange
}: {
  step: ProductionStep,
  depth?: number,
  onOverclockChange: (recipeId: string, value: number) => void,
  onRecipeChange: (itemId: string, recipeId: string) => void
}) {
  const item = itemsData.find(i => i.id === step.targetItemId);
  const machine = machinesData.find(m => m.id === step.machineId);
  const alternativeRecipes = recipesData.filter(r =>
    r.products.some(p => p.itemId === step.targetItemId)
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: depth * 0.1 }}
      className={`space-y-4 ${depth > 0 ? 'ml-8 border-l border-white/5 pl-8 relative' : ''}`}
    >
      {depth > 0 && <div className="absolute top-8 left-0 w-8 h-px bg-white/5"></div>}

      <div className="glass-panel rounded-2xl p-6 relative group hover:border-orange-500/30 transition-all duration-500">
        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="scanline"></div>

        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center gap-5">
            <ItemImage itemId={step.targetItemId} size={56} className="shadow-2xl" />
            <div>
              <h4 className="text-xl font-black tracking-tight text-white group-hover:text-orange-500 transition-colors">{item?.name}</h4>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-mono text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 uppercase font-black">
                    {step.targetAmount.toFixed(2)} / MIN
                </span>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item?.nameEn}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-8 items-center bg-zinc-950/50 px-6 py-3 rounded-xl border border-white/5">
            <div className="text-right">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Machines</p>
                <p className="text-lg font-black text-white">{step.machineCount.toFixed(2)}x <span className="text-orange-500">{machine?.name}</span></p>
            </div>
            <div className="w-px h-8 bg-white/5"></div>
            <div className="text-right">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Énergie</p>
                <p className="text-lg font-black text-white">{step.powerConsumption.toFixed(1)} <small className="text-[10px] text-zinc-500">MW</small></p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                    <Settings size={10} /> Recette Active
                </label>
                <select
                    value={step.recipeId}
                    onChange={(e) => onRecipeChange(step.targetItemId, e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-[11px] font-bold text-zinc-300 outline-none focus:border-orange-500/50 transition-colors"
                >
                    {alternativeRecipes.map(r => (
                        <option key={r.id} value={r.id}>{r.name}{r.isAlternate ? ' (Alt.)' : ''}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                    <Activity size={10} /> Cadencement
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="range" min="1" max="250" value={step.overclock}
                        onChange={(e) => onOverclockChange(step.recipeId, Number(e.target.value))}
                        className="flex-grow accent-orange-500"
                    />
                    <span className="text-xs font-mono font-black text-orange-500 w-12 text-right">{step.overclock}%</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                    <Layers size={10} /> Logistique
                </label>
                <div className="flex gap-2">
                    <div className="bg-zinc-950 px-3 py-1.5 rounded border border-white/5 flex items-center gap-2">
                        <span className="text-[9px] font-black text-zinc-500">CONV.</span>
                        <span className="text-[10px] font-black text-white">MK{step.logistics.beltTier}</span>
                    </div>
                    <div className="bg-zinc-950 px-3 py-1.5 rounded border border-white/5 flex items-center gap-2">
                        <span className="text-[9px] font-black text-zinc-500">PIPE</span>
                        <span className="text-[10px] font-black text-white">MK{step.logistics.pipeTier}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {step.childSteps.length > 0 && (
            <div className="space-y-6">
                {step.childSteps.map((child, i) => (
                    <StepCard
                        key={`${child.targetItemId}-${i}`}
                        step={child}
                        depth={depth + 1}
                        onOverclockChange={onOverclockChange}
                        onRecipeChange={onRecipeChange}
                    />
                ))}
            </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SummaryWidget({ title, icon: Icon, value, unit, color = "orange" }: { title: string, icon: any, value: string | number, unit: string, color?: string }) {
    return (
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700`}></div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                <Icon size={12} className={`text-${color}-500`} /> {title}
            </p>
            <p className="text-3xl font-black text-white tracking-tighter">
                {value} <small className="text-xs text-zinc-500 ml-1 uppercase">{unit}</small>
            </p>
        </div>
    )
}

export default function ProductionPlanner() {
  const [targetItemId, setTargetItemId] = useState('reinforced-iron-plate');
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
    <div className="p-8 bg-zinc-950 min-h-screen text-zinc-100 selection:bg-orange-500/30">
      <div className="max-w-7xl mx-auto space-y-12 pb-32">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                        <Activity className="text-zinc-950" size={28} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Command Center</h1>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">FICSIT Production Logistics v2.0</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="glass-panel px-6 py-4 rounded-2xl border-orange-500/20">
                    <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">Target Object</p>
                    <Combobox
                        options={itemsData.filter(i => i.category !== 'Resource' && i.category !== 'Waste').map(i => ({ id: i.id, name: i.name }))}
                        value={targetItemId}
                        onChange={setTargetItemId}
                    />
                </div>
                <div className="glass-panel px-6 py-4 rounded-2xl">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Production Rate</p>
                    <input
                        type="number" value={targetAmount} onChange={(e) => setTargetAmount(Number(e.target.value))}
                        className="bg-transparent border-none text-2xl font-black text-white focus:outline-none w-24 font-mono"
                    />
                </div>
            </div>
        </header>

        {plan && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <SummaryWidget title="Charge Électrique" icon={Zap} value={plan.totalPower.toFixed(1)} unit="MW" />
                <SummaryWidget title="Surface au Sol" icon={Layers} value={plan.foundationCount} unit="Dalles" color="blue" />
                <SummaryWidget title="Efficacité" icon={Activity} value={100} unit="%" color="green" />
                <div className="flex rounded-2xl bg-zinc-900 p-1 border border-white/5 shadow-inner">
                    <button
                        onClick={() => setView('tree')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${view === 'tree' ? 'bg-orange-500 text-zinc-950 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <ClipboardList size={14} /> Analyse
                    </button>
                    <button
                        onClick={() => setView('layout')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${view === 'layout' ? 'bg-orange-500 text-zinc-950 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <MapIcon size={14} /> Plan
                    </button>
                </div>
            </div>
        )}

        <AnimatePresence mode="wait">
        {view === 'tree' ? (
            <motion.div
                key="tree"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] italic">Architecture de l'Usine</h2>
                        <div className="flex-grow h-px bg-white/5"></div>
                    </div>

                    {plan?.steps.map((step, i) => (
                        <StepCard
                            key={i} step={step}
                            onOverclockChange={handleOverclockChange}
                            onRecipeChange={handleRecipeChange}
                        />
                    ))}
                </div>

                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] italic">Coûts de Construction</h2>
                        <div className="flex-grow h-px bg-white/5"></div>
                    </div>

                    <div className="glass-panel rounded-2xl p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                <span className="text-[10px] font-black text-zinc-500 uppercase">Matériau</span>
                                <span className="text-[10px] font-black text-zinc-500 uppercase">Quantité</span>
                            </div>
                            {plan?.constructionCosts.map((cost, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex justify-between items-center group"
                                >
                                    <div className="flex items-center gap-3">
                                        <ItemImage itemId={cost.itemId} size={24} />
                                        <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">{itemsData.find(it => it.id === cost.itemId)?.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-orange-500 font-mono">{cost.amount}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-orange-500/5 p-4 rounded-xl border border-orange-500/10">
                            <div className="flex gap-3">
                                <Info size={16} className="text-orange-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-orange-500/80 font-bold leading-relaxed">
                                    Ces estimations incluent les machines ainsi que les {plan?.foundationCount} dalles de fondation nécessaires pour accueillir l'emprise au sol totale.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] italic">Ressources Brutes</h2>
                        <div className="flex-grow h-px bg-white/5"></div>
                    </div>

                    <div className="glass-panel rounded-2xl p-8 space-y-4">
                        {plan && Object.entries(plan.rawResources).map(([id, amount], i) => (
                            <div key={id} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <ItemImage itemId={id} size={24} />
                                    <span className="text-xs font-bold text-zinc-300">{itemsData.find(it => it.id === id)?.name}</span>
                                </div>
                                <span className="text-sm font-black text-zinc-100 font-mono">{amount.toFixed(1)}/m</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        ) : (
            <motion.div
                key="layout"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] italic">Vue de dessus Schématique</h2>
                    <div className="flex items-center gap-2 bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full border border-blue-500/20">
                        <Info size={12} />
                        <span className="text-[9px] font-black uppercase">Échelle 1:1</span>
                    </div>
                </div>

                {layout ? (
                    <div className="glass-panel rounded-3xl p-8 overflow-hidden min-h-[600px] flex items-center justify-center">
                        <FactoryDiagram layout={layout} />
                    </div>
                ) : (
                    <div className="glass-panel rounded-3xl p-20 text-center">
                        <p className="text-zinc-500 uppercase font-black tracking-widest text-xs">Calcul de l'emprise au sol impossible</p>
                    </div>
                )}
            </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
