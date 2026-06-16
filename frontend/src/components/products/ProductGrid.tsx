"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "@/components/ui/ProductSkeleton";
import { Pagination } from "@/components/ui/Pagination";
import type { Product, Pagination as PaginationType } from "@/types";

interface ProductGridProps {
  search?: string;
  category?: string;
  page?: number;
  onPageChange?: (page: number) => void;
}

export function ProductGrid({
  search = "",
  category = "",
  page = 1,
  onPageChange,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = { page, limit: 12 };
        if (search) params.search = search;
        if (category && category !== "All") params.category = category;
        const { data } = await api.get("/products", { params });
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search, category, page]);

  if (loading) return <ProductGridSkeleton />;

  if (!products.length) {
    return (
      <p className="text-center text-slate-500 py-16">
        No products found. Try another search.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {pagination && onPageChange && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
