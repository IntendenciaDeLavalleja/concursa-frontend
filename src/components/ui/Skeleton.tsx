import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  lines?: number;
  className?: string;
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('card min-w-0 bg-base-200 animate-pulse', className)} aria-hidden="true">
      <div className="card-body gap-3 p-3 sm:p-5">
        <div className="h-5 w-3/4 rounded bg-base-300" />
        <div className="h-4 w-1/2 rounded bg-base-300" />
        <div className="mt-2 space-y-2">
          <div className="h-3 w-full rounded bg-base-300" />
          <div className="h-3 w-5/6 rounded bg-base-300" />
        </div>
        <div className="mt-3 flex gap-2">
          <div className="h-6 min-w-0 max-w-16 flex-1 rounded-full bg-base-300" />
          <div className="h-6 min-w-0 max-w-20 flex-1 rounded-full bg-base-300" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ lines = 5, className }: Props) {
  return (
    <div className={cn('space-y-3', className)} role="status">
      <span className="sr-only">Cargando contenido…</span>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} aria-hidden="true" className="h-4 rounded bg-base-300 animate-pulse" style={{ width: `${85 - i * 8}%` }} />
      ))}
    </div>
  );
}

export function SkeletonPage() {
  return (
    <motion.div
      data-motion
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl space-y-6 p-4"
      role="status"
    >
      <span className="sr-only">Cargando página…</span>
      <div className="h-8 w-48 max-w-full rounded bg-base-300 animate-pulse" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </motion.div>
  );
}
