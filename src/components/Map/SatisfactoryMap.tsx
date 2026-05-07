'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, useMap, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import nodesData from '@/data/nodes.json';
import itemsData from '@/data/items.json';
import { getAssetPath } from '@/lib/assets';
import ItemImage from '../ItemImage';

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
  [-375, -327.68], // South-West
  [375, 427.68]    // North-East
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
  const [mouseCoords, setMouseCoords] = useState<{ x: number, y: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="h-[700px] w-full bg-zinc-900 rounded-2xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Initializing Topography...</p>
      </div>
    </div>
  );

  const MapEvents = () => {
    const map = useMap();
    useEffect(() => {
      map.on('mousemove', (e: any) => {
        // Reverse transformation: [-y / 1000, x / 1000] -> [x, y]
        // lat = -y / 1000 => y = -lat * 1000
        // lng = x / 1000  => x = lng * 1000
        setMouseCoords({
          x: Math.round(e.latlng.lng * 1000),
          y: Math.round(-e.latlng.lat * 1000)
        });
      });
      map.on('mouseout', () => setMouseCoords(null));
    }, [map]);
    return null;
  };

  const filteredNodes = filter
    ? nodesData.filter(n => n.itemId === filter)
    : nodesData;

  const resourceTypes = Array.from(new Set(nodesData.map(n => n.itemId)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center bg-zinc-900/40 p-3 rounded-xl border border-white/5">
        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2 border-r border-white/10 pr-3">
          Secteur // Ressources
        </div>
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all border ${!filter ? 'bg-orange-500 text-zinc-950 border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'}`}
        >
          Tous
        </button>
        {resourceTypes.map(type => {
          const item = itemsData.find(i => i.id === type);
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border flex items-center gap-2 ${filter === type ? 'bg-orange-500 text-zinc-950 border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'}`}
            >
              <div className={`w-2 h-2 rounded-full ${filter === type ? 'bg-zinc-950' : 'bg-orange-500/50'}`}></div>
              {item?.name || type}
            </button>
          );
        })}
      </div>

      <div className="h-[700px] w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative bg-zinc-950 group/map">
        <div className="radar-sweep"></div>
        <div className="absolute inset-0 z-[400] pointer-events-none opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(242, 100, 25, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(242, 100, 25, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
        <MapContainer
          center={[0, 50]}
          zoom={2}
          minZoom={-1}
          maxZoom={6}
          scrollWheelZoom={true}
          crs={L.CRS.Simple}
          style={{ height: '100%', width: '100%', background: '#09090b' }}
          attributionControl={false}
        >
          <MapResizer />

          <ImageOverlay
            url={getAssetPath('/map-satisfactory.png')}
            bounds={mapBounds}
            opacity={0.9}
          />
          <MapEvents />

          {filteredNodes.map((node: any) => {
            const item = itemsData.find(i => i.id === node.itemId);
            return (
              <Marker
                key={node.id}
                position={gameToMap(node.coords.x, node.coords.y)}
                icon={getMarkerIcon(node.purity)}
              >
                <Popup>
                  <div className="p-1 min-w-[180px]">
                    <div className="flex items-start gap-3 mb-3">
                      <ItemImage itemId={node.itemId} size={40} />
                      <div>
                        <h3 className="font-black text-white uppercase leading-tight text-xs mb-0.5 tracking-wider">{item?.name}</h3>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            node.purity === 'Pure' ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' :
                            (node.purity === 'Normal' || node.purity === 'Normale') ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{node.purity}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                      <div className="bg-black/40 p-1.5 rounded border border-white/5">
                        <span className="block text-[7px] text-zinc-500 uppercase font-black mb-0.5">Axe X</span>
                        <span className="text-[9px] font-mono text-orange-500/80">{node.coords.x.toLocaleString()}</span>
                      </div>
                      <div className="bg-black/40 p-1.5 rounded border border-white/5">
                        <span className="block text-[7px] text-zinc-500 uppercase font-black mb-0.5">Axe Y</span>
                        <span className="text-[9px] font-mono text-orange-500/80">{node.coords.y.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex justify-center">
                       <div className="text-[8px] font-black text-orange-500/40 uppercase tracking-[0.3em]">Ficsit // Scanner</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {mouseCoords && (
          <div className="absolute bottom-6 left-6 z-[1000] flex flex-col gap-1 pointer-events-none">
            <div className="bg-zinc-950/90 backdrop-blur-md border-l-2 border-orange-500 px-4 py-2 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-0.5">Target X</span>
                  <span className="text-xs font-mono text-white leading-none">{mouseCoords.x.toLocaleString()}</span>
                </div>
                <div className="w-px h-6 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-0.5">Target Y</span>
                  <span className="text-xs font-mono text-white leading-none">{mouseCoords.y.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2">
              <div className="w-1 h-1 bg-orange-500 animate-pulse"></div>
              <span className="text-[8px] font-black text-orange-500/60 uppercase tracking-[0.4em]">Tracking Active</span>
            </div>
          </div>
        )}

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
