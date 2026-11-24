import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useConcursosDestacados } from '@/hooks/useConcursos';
import { ConcursoCard } from './ConcursoCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Animations';

export function ConcursosDestacados() {
  const { data: concursos, isLoading } = useConcursosDestacados();
  const displayConcursos = concursos ?? [];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <FadeIn>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-bold sm:text-4xl">Concursos Destacados</h2>
              <p className="mt-2 text-lg text-muted">Las oportunidades más recientes</p>
            </div>
            <Link
              to="/concursos"
              className="btn btn-ghost btn-sm gap-1.5 text-primary hidden sm:inline-flex"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>

        {isLoading ? (
          <div className="listing-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : displayConcursos.length === 0 ? (
          <EmptyState
            heading="h3"
            title="No hay concursos destacados"
            description="Todavía no hay llamados destacados publicados para mostrar en esta sección."
          />
        ) : (
          <StaggerContainer className="listing-grid">
            {displayConcursos.slice(0, 6).map((c) => (
              <StaggerItem key={c.id}>
                <ConcursoCard concurso={c} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link to="/concursos" className="btn btn-primary btn-sm gap-1.5">
            Ver todos los concursos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
