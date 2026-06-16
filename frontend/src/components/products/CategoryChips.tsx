'use client';

import { CATEGORIES } from '@/lib/utils';

interface CategoryChipsProps {
  selected: string;
  onSelect: (cat: string) => void;
}

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === cat
              ? 'gradient-brand text-white'
              : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-fuchsia-500'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
