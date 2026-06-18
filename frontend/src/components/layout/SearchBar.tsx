'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export function SearchBar({ className = '' }: { className?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('search') || '');

  useEffect(() => {
    setQ(params.get('search') || '');
  }, [params]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const search = q.trim();
    router.push(search ? `/products?search=${encodeURIComponent(search)}` : '/products');
  };

  return (
    <form onSubmit={submit} className={`relative flex-1 max-w-xl ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search sarees, kurtis, ethnic wear..."
        className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm outline-none transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#f5f5f7',
        }}
        onFocus={e => {
          (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.08)';
          (e.target as HTMLInputElement).style.borderColor = 'rgba(168,85,247,0.5)';
          (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(168,85,247,0.12), 0 0 20px rgba(168,85,247,0.1)';
        }}
        onBlur={e => {
          (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.05)';
          (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)';
          (e.target as HTMLInputElement).style.boxShadow = 'none';
        }}
      />
    </form>
  );
}
