import { FileDown } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { apiResourceUrl } from '@/services/api';
import type { ConcursoActualizacion } from '@/types';

export function ConcursoActualizaciones({ actualizaciones }: { actualizaciones: ConcursoActualizacion[] }) {
  if (actualizaciones.length === 0) return null;

  return (
    <section className="card border border-base-300 bg-base-100">
      <div className="card-body p-5 sm:p-6">
        <h2 className="font-heading text-xl font-bold">Comunicados del llamado</h2>
        <ul role="list" className="mt-2 divide-y divide-base-300">
          {actualizaciones.map((item) => (
            <li key={item.id} className="space-y-2 py-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="rounded-full bg-base-200 px-2.5 py-1 font-semibold text-primary">{item.etapa}</span>
                <time className="text-muted" dateTime={item.fecha}>{formatDate(item.fecha)}</time>
              </div>
              <h3 className="font-heading text-lg font-bold">{item.titulo}</h3>
              {item.descripcion && <p className="whitespace-pre-line text-base leading-relaxed text-muted">{item.descripcion}</p>}
              {item.pdf_url && (
                <a className="btn btn-outline btn-sm gap-2" href={apiResourceUrl(item.pdf_url)}>
                  <FileDown className="size-4 shrink-0" aria-hidden="true" />
                  Descargar PDF<span className="sr-only"> de {item.titulo}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
