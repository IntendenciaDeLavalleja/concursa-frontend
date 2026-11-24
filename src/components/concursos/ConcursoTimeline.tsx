import { CheckCircle2, Circle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { ConcursoTimeline as TimelineData } from '@/types';

interface Props {
  timeline: TimelineData[];
}

export function ConcursoTimeline({ timeline }: Props) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="card bg-base-100 border border-base-300/50">
      <div className="card-body p-5">
        <h2 className="mb-4 font-heading text-xl font-semibold">Cronograma del concurso</h2>

        <ol role="list" className="space-y-4 border-s-2 border-base-300 ps-3">
          {timeline.map((item, i) => (
            <li key={i} className="space-y-1">
              <p className="font-semibold text-sm">{item.titulo}</p>
              <time dateTime={item.fecha} className="block text-xs text-muted">{formatDate(item.fecha)}</time>
              {item.descripcion && <p className="text-sm text-muted">{item.descripcion}</p>}
              <p className="flex items-center gap-2 text-xs text-muted">
                {item.completado ? (
                  <CheckCircle2 className="size-4 shrink-0 text-primary" aria-hidden="true" />
                ) : <Circle className="size-4 shrink-0" aria-hidden="true" />}
                {item.completado ? 'Completada' : 'Pendiente'}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
