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
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search sarees, kurtis, ethnic wear..."
        className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-800 border border-gray-600 text-gray-200 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-800/50 placeholder:text-gray-500"
      />
    </form>
  );
}