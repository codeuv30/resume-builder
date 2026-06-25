// components/ui/autocomplete-input.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';

interface AutocompleteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

export function AutocompleteInput({ onValueChange, ...props }: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) { setSuggestions([]); return; }
    try {
      const res = await fetch(
        `https://universities.hipolabs.com/search?name=${encodeURIComponent(query)}&limit=6`
      );
      const data = await res.json();
      setSuggestions(data.map((u: { name: string }) => u.name));
      setShow(true);
    } catch {
      setSuggestions([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(e);
    fetchSuggestions(e.target.value);
  };

  const handleSelect = (name: string) => {
    onValueChange?.(name);
    setShow(false);
    setSuggestions([]);
  };

  return (
    <div ref={ref} className="relative">
      <Input {...props} onChange={handleChange} autoComplete="off" />
      {show && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((name) => (
            <li
              key={name}
              onMouseDown={() => handleSelect(name)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-50"
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}