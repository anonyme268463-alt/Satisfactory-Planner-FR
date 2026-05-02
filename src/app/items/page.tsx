import Link from 'next/link';
import itemsData from '@/data/items.json';

export default function ItemsPage() {
  return (
    <div className="p-8 bg-zinc-900 min-h-screen text-zinc-100">
      <h1 className="text-4xl font-bold mb-8 text-orange-500 uppercase tracking-wider">Base de données des Objets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {itemsData.map((item) => (
          <Link
            key={item.id}
            href={`/items/${item.id}`}
            className="block p-6 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-orange-500 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{item.name}</h2>
                <p className="text-zinc-400 text-sm">{item.nameEn}</p>
              </div>
              <span className="bg-zinc-700 text-zinc-300 text-xs px-2 py-1 rounded uppercase">
                {item.category}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
