'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Option {
  id: string;
  name: string;
}

interface ComboboxProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Combobox({ options, value, onChange, placeholder = "Rechercher..." }: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus-within:border-orange-500 transition-all flex justify-between items-center cursor-pointer group-hover:border-zinc-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-grow">
          {isOpen ? (
            <input
              type="text"
              autoFocus
              className="bg-transparent w-full outline-none font-bold text-sm"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="font-bold text-sm">{selectedOption?.name || placeholder}</span>
          )}
        </div>
        <div className="text-zinc-600">▼</div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-h-64 overflow-y-auto custom-scrollbar">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <div
                key={option.id}
                className={`p-3 cursor-pointer text-sm font-bold transition-colors ${option.id === value ? 'bg-orange-500 text-zinc-950' : 'hover:bg-zinc-800 text-zinc-300'}`}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                  setSearch('');
                }}
              >
                {option.name}
              </div>
            ))
          ) : (
            <div className="p-3 text-sm text-zinc-500 italic">Aucun résultat</div>
          )}
        </div>
      )}
    </div>
  );
}
