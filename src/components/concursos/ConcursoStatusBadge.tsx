import type { ConcursoEstado } from '@/types';
import { ESTADO_COLORS, ESTADO_LABELS } from '@/constants';
import { cn } from '@/lib/utils';

interface Props {
  estado: ConcursoEstado;
  size?: 'sm' | 'md' | 'lg';
}

export function ConcursoStatusBadge({ estado, size = 'md' }: Props) {
  const sizeClass = {
    sm: 'badge-sm text-xs',
    md: 'badge-md text-xs',
    lg: 'badge-lg text-sm',
  }[size];

  return (
    <span className={cn('badge gap-1.5 font-semibold uppercase tracking-wider', ESTADO_COLORS[estado].badge, sizeClass)}>
      <span className={cn('size-1.5 shrink-0 rounded-full', ESTADO_COLORS[estado].dot)} aria-hidden="true" />
      {ESTADO_LABELS[estado]}
    </span>
  );
}
