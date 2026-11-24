import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = generatePageRange(page, totalPages);

  return (
    <nav aria-label="Páginas de resultados" className="mt-8 flex flex-wrap items-center justify-center gap-1">
      <button
        type="button"
        className="btn btn-ghost btn-sm btn-circle"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-muted" aria-hidden="true">…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => { if (p !== page) onPageChange(p); }}
            aria-label={`Página ${p}`}
            aria-current={page === p ? 'page' : undefined}
            className={`btn btn-sm btn-circle ${page === p ? 'btn-primary' : 'btn-ghost'}`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        className="btn btn-ghost btn-sm btn-circle"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

function generatePageRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [1];

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');

  pages.push(total);
  return pages;
}
