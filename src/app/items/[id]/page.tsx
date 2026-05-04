import { notFound } from 'next/navigation';
import itemsData from '@/data/items.json';
import recipesData from '@/data/recipes.json';
import machinesData from '@/data/machines.json';
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

  // Power and Efficiency comparison for production recipes
  const comparison = recipesProducing.map(r => {
    const mainProduct = r.products.find((p: any) => p.itemId === id);
    const amountPerMin = mainProduct?.amount || 1;
    const machine = (machinesData as any[]).find(m => m.id === r.producedIn);
    const powerPerUnit = machine ? machine.powerConsumption / amountPerMin : 0;

    return {
      id: r.id,
      name: r.name,
      powerPerUnit,
      producedIn: machine?.name || r.producedIn,
      ingredients: r.ingredients
    };
  }).sort((a, b) => a.powerPerUnit - b.powerPerUnit);

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

        {recipesProducing.length > 1 && (
          <div className="mt-12 bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6">
            <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
              Analyse Comparative des Recettes
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] text-zinc-500 uppercase font-black border-b border-zinc-800">
                    <th className="pb-4">Recette</th>
                    <th className="pb-4 text-right">Énergie / Unité</th>
                    <th className="pb-4">Bâtiment</th>
                    <th className="pb-4">Complexité Ingrédients</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((c) => (
                    <tr key={c.id} className="border-b border-zinc-800/50 group hover:bg-zinc-800/30 transition-colors">
                      <td className="py-4 font-bold text-sm">{c.name}</td>
                      <td className="py-4 text-right font-mono text-orange-400 font-bold">{c.powerPerUnit.toFixed(3)} <span className="text-[9px] text-zinc-600 uppercase">MW/u</span></td>
                      <td className="py-4 text-xs text-zinc-400 font-medium">{c.producedIn}</td>
                      <td className="py-4">
                        <div className="flex gap-1">
                          {c.ingredients.map((ing: any) => (
                            <span key={ing.itemId} title={ing.itemId} className="w-2 h-2 bg-zinc-700 rounded-full border border-zinc-600"></span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[10px] text-zinc-500 italic">L'analyse d'énergie est basée sur la consommation nominale du bâtiment par unité produite du produit principal.</p>
          </div>
        )}

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
