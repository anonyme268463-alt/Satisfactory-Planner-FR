import Link from 'next/link';
import itemsData from '@/data/items.json';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-12">
        <header className="space-y-4">
          <div className="inline-block bg-orange-500 text-zinc-950 font-black text-6xl px-4 py-2 rounded-lg transform -rotate-2 mb-6">
            SFFR
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter text-zinc-100">
            Satisfactory <span className="text-orange-500">Planner</span> FR
          </h1>
          <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
            L'outil d'ingénierie ultime pour optimiser vos usines sur Satisfactory 1.0. Calculs précis, base de données complète et planification avancée.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/planner" className="group p-8 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-orange-500 transition-all hover:scale-105 text-left space-y-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-zinc-950 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Planificateur</h2>
            <p className="text-sm text-zinc-500">Calculez vos chaînes de production et l'énergie nécessaire en un clic.</p>
          </Link>

          <Link href="/items" className="group p-8 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-orange-500 transition-all hover:scale-105 text-left space-y-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-zinc-950 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Base de données</h2>
            <p className="text-sm text-zinc-500">Explorez tous les objets, ressources et bâtiments du jeu.</p>
          </Link>

          <Link href="/power" className="group p-8 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-orange-500 transition-all hover:scale-105 text-left space-y-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-zinc-950 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Énergie</h2>
            <p className="text-sm text-zinc-500">Gérez votre grille électrique et vos générateurs.</p>
          </Link>
        </div>

        <footer className="pt-12 border-t border-zinc-900 text-zinc-600 text-xs uppercase tracking-[0.3em]">
          FICSIT Inc. © 2024 - Engineering Division
        </footer>
      </div>
    </div>
  );
}
