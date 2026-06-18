'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Gem } from 'lucide-react';
import { CategoryChips } from '@/components/products/CategoryChips';
import { ProductGrid } from '@/components/products/ProductGrid';

function ProductsContent() {
  const params = useSearchParams();
  const [category, setCategory] = useState(params.get('category') || 'All');
  const [page, setPage] = useState(1);
  const search = params.get('search') || '';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-gray-800 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Gem className="w-6 h-6 text-purple-400" />
          <h1 className="font-display text-2xl font-bold text-gray-100">All Products</h1>
        </div>
        {search && (
          <p className="text-gray-400 text-sm mb-4">
            Results for &ldquo;{search}&rdquo;
          </p>
        )}
        <CategoryChips
          selected={category}
          onSelect={(c) => {
            setCategory(c);
            setPage(1);
          }}
        />
        <div className="mt-6">
          <ProductGrid
            search={search}
            category={category}
            page={page}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 animate-pulse h-96 bg-gray-700 rounded-xl" />}>
      <ProductsContent />
    </Suspense>
  );
}