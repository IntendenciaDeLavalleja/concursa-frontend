import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { ConcursoStatusBadge } from '@/components/concursos/ConcursoStatusBadge';
import { formatDate, daysUntil } from '@/lib/utils';
import type { ConcursoListItem } from '@/types';

interface Props {
  concurso: ConcursoListItem;
  destacarActivos?: boolean;
}

export function ConcursoCard({ concurso, destacarActivos = false }: Props) {
  const activo = concurso.estado === 'abierto';
  const diasRestantes = daysUntil(concurso.fecha_cierre);
  const urgente = activo && diasRestantes <= 5 && diasRestantes > 0;
  const etiquetas = [...new Set([concurso.tipo_llamado, concurso.tipo_contratacion, concurso.area_convocante].filter(Boolean))];

  return (
    <article className="concurso-card h-full min-w-0" data-activo={destacarActivos && activo ? '' : undefined}>
      {destacarActivos && activo && <span className="concurso-card-glow" aria-hidden="true" />}
      <div className="concurso-card-surface listing-card-body flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ConcursoStatusBadge estado={concurso.estado} size="sm" />
          {urgente && <span className="text-sm font-semibold text-error">Cierra pronto</span>}
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-xl font-extrabold leading-snug tracking-tight sm:text-2xl">{concurso.titulo}</h3>
          {concurso.subtitulo && <p className="text-base leading-relaxed text-muted">{concurso.subtitulo}</p>}
        </div>

        <div className="mt-auto pt-1">
          <dl className="concurso-card-meta grid grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] gap-3 text-sm">
            <div>
              <dt className="flex items-center gap-1.5 text-muted"><Calendar className="size-4 shrink-0" aria-hidden="true" /> Cierre</dt>
              <dd className="mt-0.5 font-semibold"><time dateTime={concurso.fecha_cierre}>{formatDate(concurso.fecha_cierre)}</time></dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-muted"><Users className="size-4 shrink-0" aria-hidden="true" /> Cargos</dt>
              <dd className="mt-0.5 font-semibold tabular-nums">{concurso.cantidad_cargos}</dd>
            </div>
            {concurso.localidad && (
              <div>
                <dt className="flex items-center gap-1.5 text-muted"><MapPin className="size-4 shrink-0" aria-hidden="true" /> Localidad</dt>
                <dd className="mt-0.5 font-semibold">{concurso.localidad}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="flex flex-wrap gap-2">
          {etiquetas.map((etiqueta) => (
            <span key={etiqueta} className="rounded-full border border-base-300 px-2.5 py-1 text-xs font-semibold text-muted">{etiqueta}</span>
          ))}
        </div>
        <Link to={`/concursos/${concurso.slug}`} className="concurso-card-link flex min-h-12 items-center justify-between gap-2 border-t border-base-300 pt-2 font-semibold text-primary">
          <span>Ver llamado<span className="sr-only"> {concurso.titulo}</span></span>
          <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
