import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Satisfactory Planner FR",
  description: "L'outil d'ingénierie ultime pour Satisfactory 1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased selection:bg-orange-500/30`}>
        <nav className="fixed top-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 z-[5000] flex items-center px-8 justify-between">
            <Link href="/" className="flex items-center gap-3 group">
                <div className="bg-orange-500 text-zinc-950 font-black px-2 py-0.5 rounded text-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">S</div>
                <span className="font-black uppercase tracking-tighter text-xl">SFFR <span className="text-orange-500 text-xs italic">v1.2</span></span>
            </Link>

            <div className="flex gap-8 items-center">
                <Link href="/planner" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-orange-500 transition-colors">Planificateur</Link>
                <Link href="/map" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-orange-500 transition-colors">Carte</Link>
                <Link href="/items" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-orange-500 transition-colors">Base de données</Link>
                <Link href="/power" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-orange-500 transition-colors">Énergie</Link>
            </div>

            <div className="hidden md:flex items-center gap-4 bg-zinc-900/50 px-4 py-1.5 rounded-full border border-zinc-800">
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-zinc-500 uppercase leading-none">FICSIT ID</span>
                    <span className="text-[10px] font-mono text-orange-500 font-bold uppercase">Pioneer-842</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                    <div className="w-4 h-4 bg-orange-500 rounded-sm transform rotate-45 animate-pulse"></div>
                </div>
            </div>
        </nav>
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
