import Link from 'next/link';
import recipesData from '@/data/recipes.json';

export default function RecipesPage() {
  return (
    <div className="p-8 bg-zinc-900 min-h-screen text-zinc-100">
      <h1 className="text-4xl font-bold mb-8 text-orange-500 uppercase tracking-wider">Base de données des Recettes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipesData.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.id}`}
            className="block p-6 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-orange-500 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{recipe.name}</h2>
                <p className="text-zinc-400 text-sm">{recipe.nameEn}</p>
              </div>
              {recipe.isAlternate && (
                <span className="bg-purple-900 text-purple-100 text-xs px-2 py-1 rounded uppercase">
                  Alternative
                </span>
              )}
            </div>
            <p className="text-sm mt-4 text-zinc-500 italic">Machine: {recipe.producedIn}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
