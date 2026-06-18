'use client';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1.5 rounded-lg border border-gray-600 text-gray-300 text-sm disabled:opacity-40 hover:bg-gray-700"
      >
        Prev
      </button>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="text-gray-500">…</span>}
          <button
            type="button"
            onClick={() => onPageChange(p)}
            className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm ${
              p === page
                ? 'gradient-brand text-white font-medium shadow-sm'
                : 'border border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1.5 rounded-lg border border-gray-600 text-gray-300 text-sm disabled:opacity-40 hover:bg-gray-700"
      >
        Next
      </button>
    </div>
  );
}