'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import nodesData from '@/data/nodes.json';
import itemsData from '@/data/items.json';

// Fix Leaflet icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Satisfactory map coordinates to Leaflet lat/lng
// Total game area is roughly 8km x 8km
// Map bounds: X[-300000, 450000], Y[-300000, 450000] approx
const gameToLat = (y: number) => y / 2000;
const gameToLng = (x: number) => x / 2000;

export default function SatisfactoryMap() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[600px] bg-zinc-900 animate-pulse rounded-2xl" />;

  const filteredNodes = filter
    ? nodesData.filter(n => n.itemId === filter)
    : nodesData;

  const resourceTypes = Array.from(new Set(nodesData.map(n => n.itemId)));

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${!filter ? 'bg-orange-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
        >
          Tous
        </button>
        {resourceTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${filter === type ? 'bg-orange-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
          >
            {itemsData.find(i => i.id === type)?.name || type}
          </button>
        ))}
      </div>

      <div className="h-[700px] w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative">
        <MapContainer
          center={[0, 0]}
          zoom={3}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', background: '#18181b' }}
        >
          {/* Using a topographical-style tile layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=f031023709b14c778a8764b84b72782b"
          />

          {filteredNodes.map((node: any) => {
            const item = itemsData.find(i => i.id === node.itemId);
            return (
              <Marker
                key={node.id}
                position={[gameToLat(node.coords.y), gameToLng(node.coords.x)]}
              >
                <Popup>
                  <div className="p-1 font-sans">
                    <h3 className="font-black text-zinc-900 uppercase leading-tight">{item?.name}</h3>
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-tighter">Pureté: {node.purity}</p>
                    <p className="text-[10px] text-zinc-500 font-mono mt-1">X: {node.coords.x} Y: {node.coords.y}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        <div className="absolute top-4 right-4 z-[1000] bg-zinc-900/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl max-w-xs">
            <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-2">Légende Topographique</h4>
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    <span className="text-[9px] text-zinc-300 font-bold uppercase">Pure</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                    <span className="text-[9px] text-zinc-300 font-bold uppercase">Normale</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                    <span className="text-[9px] text-zinc-300 font-bold uppercase">Impure</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
