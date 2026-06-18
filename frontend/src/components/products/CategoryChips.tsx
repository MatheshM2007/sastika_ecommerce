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
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selected === cat
              ? 'gradient-brand text-white shadow-md'
              : 'bg-gray-800/60 border border-gray-600 text-gray-300 hover:border-purple-500 hover:bg-gray-700'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}