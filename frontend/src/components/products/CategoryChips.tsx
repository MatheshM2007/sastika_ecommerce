'use client';

import { CATEGORIES } from '@/lib/utils';

interface CategoryChipsProps {
  selected: string;
  onSelect: (cat: string) => void;
}

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
      {CATEGORIES.map((cat) => {
        const isSelected = selected === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            style={isSelected ? {
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)',
              color: 'white',
              boxShadow: '0 0 20px rgba(168,85,247,0.35)',
              border: '1px solid transparent',
              transform: 'scale(1.05)',
            } : {
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.55)',
            }}
            onMouseEnter={e => {
              if (!isSelected) {
                (e.currentTarget as HTMLElement).style.background = 'rgba(168,85,247,0.1)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.3)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)';
              }
            }}
            onMouseLeave={e => {
              if (!isSelected) {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
              }
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
