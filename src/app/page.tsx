import Link from 'next/link';
import { ChevronRight, Zap, Database, Map as MapIcon, Activity } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 blur-[128px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[128px] rounded-full"></div>

      <div className="max-w-5xl w-full text-center space-y-16 relative z-10">
        <header className="space-y-6">
          <div className="inline-flex items-center gap-4 bg-zinc-900 px-6 py-2 rounded-full border border-zinc-800 animate-fade-in">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">FICSIT System Online v1.0.2</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-8xl font-black uppercase tracking-tighter text-white leading-none">
                Satisfactory <br />
                <span className="text-orange-500 italic">Planner</span> <span className="text-zinc-800">FR</span>
            </h1>
          </div>

          <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Optimisez votre production industrielle avec une précision chirurgicale.
            Base de données complète 1.0, cartographie planétaire et simulateur d'ingénierie.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MenuCard
            href="/planner"
            title="Planificateur"
            desc="Calculez vos chaînes et vos dalles de fondation."
            icon={Activity}
            color="orange"
          />
          <MenuCard
            href="/map"
            title="Carte"
            desc="Localisez chaque gisement pur sur la planète."
            icon={MapIcon}
            color="blue"
          />
          <MenuCard
            href="/items"
            title="Archives"
            desc="Base de données exhaustive des 350+ objets."
            icon={Database}
            color="zinc"
          />
        </div>

        <div className="flex justify-center gap-12 pt-12 border-t border-white/5 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            <StatItem label="Recettes" value="400+" />
            <StatItem label="Objets" value="351" />
            <StatItem label="Logistique" value="MK6" />
        </div>

        <footer className="pt-12 text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em]">
          Engineering Division &copy; 2024 - Stay Productive
        </footer>
      </div>
    </div>
  );
}

function MenuCard({ href, title, desc, icon: Icon, color }: any) {
    const colors: any = {
        orange: "hover:border-orange-500/50 hover:shadow-orange-500/10 text-orange-500 bg-orange-500/10",
        blue: "hover:border-blue-500/50 hover:shadow-blue-500/10 text-blue-500 bg-blue-500/10",
        zinc: "hover:border-zinc-500/50 hover:shadow-zinc-500/10 text-zinc-500 bg-zinc-500/10"
    };

    return (
        <Link href={href} className={`group p-8 glass-panel rounded-3xl text-left space-y-6 transition-all duration-500 hover:-translate-y-2 ${colors[color]}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500 ${colors[color]}`}>
                <Icon size={28} />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                    {title} <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h2>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">{desc}</p>
            </div>
        </Link>
    );
}

function StatItem({ label, value }: any) {
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
            <span className="text-2xl font-black text-white">{value}</span>
        </div>
    )
}
