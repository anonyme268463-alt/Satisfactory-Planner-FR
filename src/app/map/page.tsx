'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const SatisfactoryMap = dynamic(() => import('@/components/Map/SatisfactoryMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] w-full bg-zinc-900 rounded-2xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Initializing Topography...</p>
      </div>
    </div>
  )
});

export default function MapPage() {
  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-zinc-100">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
            <div className="space-y-2">
                <Link href="/" className="text-orange-500 hover:text-orange-400 transition-colors text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    FICSIT HQ
                </Link>
                <h1 className="text-5xl font-black uppercase tracking-tighter text-zinc-100">Carte <span className="text-orange-500 italic">Planétaire</span></h1>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1">Status du Scanner</p>
                <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                    <span className="text-[9px] font-black text-zinc-300 uppercase">Synchronisé</span>
                </div>
            </div>
        </header>

        <SatisfactoryMap />

        <footer className="pt-12 border-t border-zinc-900 flex justify-between items-center text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
            <span>Exploration Division - Secteur 0</span>
            <span className="italic">Projet Satisfactory Factory Planner FR</span>
        </footer>
      </div>
    </div>
  );
}
