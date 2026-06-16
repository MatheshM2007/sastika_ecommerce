'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CategoryChips } from '@/components/products/CategoryChips';
import { ProductGrid } from '@/components/products/ProductGrid';

function ProductsContent() {
  const params = useSearchParams();
  const [category, setCategory] = useState(params.get('category') || 'All');
  const [page, setPage] = useState(1);
  const search = params.get('search') || '';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold mb-2">All Products</h1>
      {search && (
        <p className="text-slate-400 text-sm mb-4">
          Results for &quot;{search}&quot;
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
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 animate-pulse h-96 bg-slate-900 rounded-xl" />}>
      <ProductsContent />
    </Suspense>
  );
}
