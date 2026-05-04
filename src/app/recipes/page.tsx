'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import recipesData from '@/data/recipes.json';

export default function RecipesPage() {
  const [search, setSearch] = useState('');

  const filteredRecipes = recipesData.filter(recipe =>
    recipe.name.toLowerCase().includes(search.toLowerCase()) ||
    recipe.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-zinc-900 min-h-screen text-zinc-100">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
            <Link href="/" className="text-orange-500 hover:underline mb-4 inline-block">← Accueil</Link>
            <h1 className="text-4xl font-bold text-orange-500 uppercase tracking-wider">Base de données des Recettes</h1>
        </header>

        <div className="mb-8">
            <input
                type="text"
                placeholder="Rechercher une recette..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecipes.map((recipe) => (
            <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="block p-6 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-orange-500 transition-colors group"
            >
                <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold group-hover:text-orange-400">{recipe.name}</h2>
                    <p className="text-zinc-400 text-sm">{recipe.nameEn}</p>
                </div>
                {recipe.isAlternate && (
                    <span className="bg-purple-900 text-purple-100 text-xs px-2 py-1 rounded uppercase font-bold">
                    Alternative
                    </span>
                )}
                </div>
                <p className="text-sm mt-4 text-zinc-500 italic">Machine: {recipe.producedIn}</p>
            </Link>
            ))}
        </div>

        {filteredRecipes.length === 0 && (
            <p className="text-zinc-500 text-center py-20 uppercase font-bold tracking-widest">Aucun résultat trouvé</p>
        )}
      </div>
    </div>
  );
}
