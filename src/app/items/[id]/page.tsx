import { notFound } from 'next/navigation';
import itemsData from '@/data/items.json';
import recipesData from '@/data/recipes.json';
import Link from 'next/link';

export function generateStaticParams() {
  return itemsData.map((item) => ({
    id: item.id,
  }));
}

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = itemsData.find((i) => i.id === id);

  if (!item) {
    notFound();
  }

  const recipesProducing = recipesData.filter((r) =>
    r.products.some((p) => p.itemId === id)
  );

  const recipesUsing = recipesData.filter((r) =>
    r.ingredients.some((i) => i.itemId === id)
  );

  return (
    <div className="p-8 bg-zinc-900 min-h-screen text-zinc-100">
      <Link href="/items" className="text-orange-500 hover:underline mb-4 inline-block">
        ← Retour à la liste
      </Link>

      <div className="bg-zinc-800 p-8 rounded-xl border border-zinc-700 mt-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-orange-500 uppercase">{item.name}</h1>
            <p className="text-xl text-zinc-400 italic">{item.nameEn}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-500 uppercase">Catégorie</p>
            <p className="text-lg font-semibold">{item.category}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <section>
            <h2 className="text-2xl font-bold mb-4 border-b border-zinc-700 pb-2 uppercase tracking-tight">Utilisé dans les recettes</h2>
            {recipesProducing.length > 0 ? (
              <ul className="space-y-4">
                {recipesProducing.map((r) => (
                  <li key={r.id} className="bg-zinc-700/50 p-4 rounded border border-zinc-600">
                    <Link href={`/recipes/${r.id}`} className="font-bold hover:text-orange-400">
                      {r.name}
                    </Link>
                    <p className="text-sm text-zinc-400">Produit dans: {r.producedIn}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500">Aucune recette ne produit cet objet directement.</p>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 border-b border-zinc-700 pb-2 uppercase tracking-tight">Ingrédient pour</h2>
            {recipesUsing.length > 0 ? (
              <ul className="space-y-4">
                {recipesUsing.map((r) => (
                  <li key={r.id} className="bg-zinc-700/50 p-4 rounded border border-zinc-600">
                    <Link href={`/recipes/${r.id}`} className="font-bold hover:text-orange-400">
                      {r.name}
                    </Link>
                    <p className="text-sm text-zinc-400">Utilisé pour produire: {r.products.map(p => p.itemId).join(', ')}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500">Cet objet n'est utilisé comme ingrédient dans aucune recette.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
