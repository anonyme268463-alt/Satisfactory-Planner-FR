import { notFound } from 'next/navigation';
import recipesData from '@/data/recipes.json';
import itemsData from '@/data/items.json';
import Link from 'next/link';

export function generateStaticParams() {
  return recipesData.map((recipe) => ({
    id: recipe.id,
  }));
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = recipesData.find((r) => r.id === id);

  if (!recipe) {
    notFound();
  }

  const getItem = (itemId: string) => {
    return itemsData.find(i => i.id === itemId);
  };

  return (
    <div className="p-8 bg-zinc-900 min-h-screen text-zinc-100">
      <Link href="/recipes" className="text-orange-500 hover:underline mb-4 inline-block">
        ← Retour à la liste
      </Link>

      <div className="bg-zinc-800 p-8 rounded-xl border border-zinc-700 mt-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-orange-500 uppercase">{recipe.name}</h1>
              {recipe.isAlternate && (
                <span className="bg-purple-900 text-purple-100 text-xs px-3 py-1 rounded-full uppercase font-bold tracking-widest">Recette Alternative</span>
              )}
            </div>
            <p className="text-xl text-zinc-400 italic">{recipe.nameEn}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-500 uppercase">Machine</p>
            <p className="text-lg font-semibold">{recipe.producedIn}</p>
            <p className="text-sm text-zinc-500 mt-2 uppercase">Durée du cycle</p>
            <p className="text-lg font-semibold">{recipe.duration}s</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <section>
            <h2 className="text-2xl font-bold mb-6 border-b border-zinc-700 pb-2 uppercase tracking-tight flex items-center gap-2">
              <span className="w-2 h-6 bg-red-500 inline-block"></span> Ingrédients (Entrée)
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ing) => {
                const item = getItem(ing.itemId);
                return (
                  <li key={ing.itemId} className="flex justify-between items-center bg-zinc-700/30 p-4 rounded border border-zinc-600/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-900 rounded flex items-center justify-center border border-zinc-700">
                        <div className="text-sm opacity-20">📦</div>
                      </div>
                      <Link href={`/items/${ing.itemId}`} className="font-semibold hover:text-orange-400">
                        {item?.name || ing.itemId}
                      </Link>
                    </div>
                    <span className="text-orange-500 font-mono font-bold">{ing.amount} / min</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 border-b border-zinc-700 pb-2 uppercase tracking-tight flex items-center gap-2">
              <span className="w-2 h-6 bg-green-500 inline-block"></span> Produits (Sortie)
            </h2>
            <ul className="space-y-3">
              {recipe.products.map((p) => {
                const item = getItem(p.itemId);
                return (
                  <li key={p.itemId} className="flex justify-between items-center bg-zinc-700/30 p-4 rounded border border-zinc-600/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-900 rounded flex items-center justify-center border border-zinc-700">
                        <div className="text-sm opacity-20">📦</div>
                      </div>
                      <Link href={`/items/${p.itemId}`} className="font-semibold hover:text-orange-400">
                        {item?.name || p.itemId}
                      </Link>
                    </div>
                    <span className="text-green-500 font-mono font-bold">{p.amount} / min</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
