import { TrendingUp, Clock, CheckCircle2, Archive, Users } from 'lucide-react';
import { useEstadisticas } from '@/hooks/useConcursos';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Animations';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ESTADO_LABELS } from '@/constants';

const STAT_CONFIG = [
  { key: 'abiertos', label: ESTADO_LABELS.abierto, icon: TrendingUp, color: 'text-success' },
  { key: 'en_proceso', label: ESTADO_LABELS.en_proceso, icon: Clock, color: 'text-info' },
  { key: 'finalizados', label: 'Finalizados', icon: CheckCircle2, color: 'text-muted' },
  { key: 'archivados', label: 'Archivados', icon: Archive, color: 'text-muted' },
  { key: 'postulaciones_en_curso', label: 'Postulaciones', icon: Users, color: 'text-primary' },
] as const;

const STAT_GRID = 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] gap-4';

export function EstadisticasHome() {
  const { data: stats, isLoading } = useEstadisticas();

  if (!isLoading && !stats) {
    return null;
  }

  const displayStats = stats;

  return (
    <section className="py-16 bg-base-200/30">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <FadeIn>
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">Concursos en Números</h2>
            <p className="mt-2 text-muted">Estado actual de los concursos públicos</p>
          </div>
        </FadeIn>

        {isLoading ? (
          <div className={STAT_GRID}>
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : displayStats ? (
          <StaggerContainer className={STAT_GRID}>
            {STAT_CONFIG.map(({ key, label, icon: Icon, color }) => (
              <StaggerItem key={key}>
                <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body items-center p-3 text-center sm:p-5">
                    <Icon className={`h-7 w-7 ${color}`} aria-hidden="true" />
                    <span className="text-3xl font-bold font-heading">
                      {displayStats[key]}
                    </span>
                    <span className="text-xs font-medium text-muted uppercase tracking-wider">
                      {label}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : null}
      </div>
    </section>
  );
}
