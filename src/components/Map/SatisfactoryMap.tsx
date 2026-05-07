'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, useMap, ImageOverlay } from 'react-leaflet';
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

// Satisfactory map coordinates to Leaflet
// Satisfactory coords are in cm. We scale them for Leaflet Simple CRS.
// North is Y negative in game, but should be positive Latitude in Leaflet.
const gameToMap = (x: number, y: number): [number, number] => {
  return [-y / 1000, x / 1000];
};

const mapBounds: L.LatLngBoundsExpression = [
  [-375, -327.68], // Bottom-Left (South-West)
  [375, 427.68]    // Top-Right (North-East)
];

const getMarkerIcon = (purity: string) => {
  let color = '#22c55e'; // Pure
  if (purity === 'Normal' || purity === 'Normale') color = '#eab308';
  if (purity === 'Impure') color = '#ef4444';

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid #18181b;
      box-shadow: 0 0 15px ${color}aa, inset 0 0 5px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

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
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all shrink-0 border border-transparent ${!filter ? 'bg-orange-500 text-zinc-950 shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:border-zinc-600'}`}
        >
          Tous
        </button>
        {resourceTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all shrink-0 border border-transparent ${filter === type ? 'bg-orange-500 text-zinc-950 shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:border-zinc-600'}`}
          >
            {itemsData.find(i => i.id === type)?.name || type}
          </button>
        ))}
      </div>

      <div className="h-[700px] w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative bg-zinc-950 group">
        <MapContainer
          center={[0, 50]}
          zoom={1}
          minZoom={-1}
          maxZoom={5}
          scrollWheelZoom={true}
          crs={L.CRS.Simple}
          style={{ height: '100%', width: '100%', background: '#09090b' }}
        >
          <MapResizer />

          <ImageOverlay
            url="/map-satisfactory.png"
            bounds={mapBounds}
            opacity={0.8}
          />

          {filteredNodes.map((node: any) => {
            const item = itemsData.find(i => i.id === node.itemId);
            return (
              <Marker
                key={node.id}
                position={gameToMap(node.coords.x, node.coords.y)}
                icon={getMarkerIcon(node.purity)}
              >
                <Popup>
                  <div className="p-2 min-w-[120px]">
                    <h3 className="font-black text-zinc-900 uppercase leading-tight text-sm mb-1">{item?.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${
                        node.purity === 'Pure' ? 'bg-green-500' :
                        (node.purity === 'Normal' || node.purity === 'Normale') ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">{node.purity}</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-zinc-100 flex justify-between text-[9px] font-mono text-zinc-400">
                      <span>X: {node.coords.x}</span>
                      <span>Y: {node.coords.y}</span>
                    </div>
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
