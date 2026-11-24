import { Calendar, MapPin, Users, Briefcase, DollarSign, Building2 } from 'lucide-react';
import { ConcursoStatusBadge } from './ConcursoStatusBadge';
import { formatConcursoDateTime, formatDateLong, daysUntil } from '@/lib/utils';
import type { Concurso } from '@/types';

interface Props {
  concurso: Concurso;
}

export function ConcursoDetailHeader({ concurso }: Props) {
  const diasRestantes = daysUntil(concurso.fecha_cierre);
  const formatPlazo = concurso.postulacion_web_habilitada ? formatConcursoDateTime : formatDateLong;

  return (
    <header className="concursos-heading space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <ConcursoStatusBadge estado={concurso.estado} size="lg" />
        {concurso.estado === 'abierto' && diasRestantes > 0 && diasRestantes <= 7 && (
          <span className="badge badge-error badge-outline font-semibold">
            Cierra en {diasRestantes} {diasRestantes === 1 ? 'día' : 'días'}
          </span>
        )}
      </div>

      <div>
        <h1 className="page-title">
          {concurso.titulo}
        </h1>
        {concurso.subtitulo && (
          <p className="mt-2 text-lg text-muted">{concurso.subtitulo}</p>
        )}
      </div>

      {/* Key info grid */}
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <InfoChip icon={Building2} label="Área" value={concurso.area_convocante.nombre} />
        {concurso.tipo_llamado && <InfoChip icon={Briefcase} label="Tipo de llamado" value={concurso.tipo_llamado.nombre} />}
        <InfoChip icon={Briefcase} label="Tipo de vínculo" value={concurso.tipo_contratacion.nombre} />
        <InfoChip icon={Users} label="Cargos" value={String(concurso.cantidad_cargos)} />
        {concurso.remuneracion && <InfoChip icon={DollarSign} label="Remuneración" value={concurso.remuneracion} />}
        {concurso.localidad && <InfoChip icon={MapPin} label="Localidad" value={concurso.localidad} />}
        <InfoChip icon={Calendar} label="Apertura" value={<time dateTime={concurso.fecha_apertura}>{formatPlazo(concurso.fecha_apertura)}</time>} />
        <InfoChip icon={Calendar} label="Cierre" value={<time dateTime={concurso.fecha_cierre}>{formatPlazo(concurso.fecha_cierre)}</time>} />
      </dl>
      {concurso.postulacion_web_habilitada && <p className="text-sm text-muted">Horarios de Uruguay.</p>}
    </header>
  );
}

function InfoChip({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="relative min-w-0 rounded-xl bg-base-200/50 py-3 pe-3 ps-14">
      <dt className="text-xs font-medium uppercase tracking-wider text-muted">
        <span className="absolute start-3 top-1/2 -translate-y-1/2 rounded-lg bg-primary/10 p-2" aria-hidden="true">
          <Icon className="size-4 text-primary" />
        </span>
        {label}
      </dt>
      <dd className="text-sm font-semibold">{value}</dd>
    </div>
  );
}
