import { FiltrosConcursos } from '@/components/concursos/FiltrosConcursos';
import { ConcursoCard } from '@/components/home/ConcursoCard';
import { Pagination } from '@/components/ui/Pagination';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { useConcursos } from '@/hooks/useConcursos';
import { useFiltersStore } from '@/store/filtersStore';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Pause, Play } from 'lucide-react';
import { useAccessibilityStore } from '@/store/accessibilityStore';

export default function ConcursosPage() {
  usePageTitle('Concursos públicos');
  const { filters, setFilter, setFilters } = useFiltersStore();
  const [search, setSearch] = useState(filters.search);
  const { data, isLoading, isFetching, isError, refetch } = useConcursos({ ...filters, search });
  const [searchParams] = useSearchParams();
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useAccessibilityStore((state) => state.reduceMotion);
  const setReduceMotion = useAccessibilityStore((state) => state.setReduceMotion);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(filters.search), 250);
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  // Apply URL search params on mount
  useEffect(() => {
    const search = searchParams.get('search');
    const tipo = searchParams.get('tipo');
    if (search || tipo) {
      setFilters({
        search: search ?? undefined,
        tipo_llamado_slug: tipo ?? undefined,
      });
    }
  }, [searchParams, setFilters]);

  const concursos = data?.items ?? [];
  const totalPages = data?.pages ?? 1;
  const updating = isFetching || search !== filters.search;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <Breadcrumbs items={[{ label: 'Concursos' }]} />

      <header className="concursos-heading mb-5 mt-5">
        <h1 className="page-title">
          Concursos Públicos
        </h1>
        <p className="mt-3 max-w-prose text-lg text-muted">
          Explorá todas las oportunidades laborales de la Intendencia de Lavalleja
        </p>
      </header>

      <FiltrosConcursos />

      <section className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div>
            <h2 ref={resultsHeading} tabIndex={-1} className="font-heading text-2xl font-bold">Resultados de concursos</h2>
            <p role="status" className="mt-1 text-sm text-muted">
              {!updating && !isError && data && `${data.total} ${data.total === 1 ? 'concurso encontrado' : 'concursos encontrados'}`}
            </p>
          </div>
          {concursos.some((concurso) => concurso.estado === 'abierto') && (
            <button type="button" className="btn btn-ghost btn-sm gap-2 motion-reduce:hidden" onClick={() => setReduceMotion(!reduceMotion)}>
              {reduceMotion ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
              {reduceMotion ? 'Reanudar animaciones' : 'Pausar animaciones'}
            </button>
          )}
        </div>
        <div aria-busy={updating}>
          {isLoading ? (
            <div className="listing-grid">
              {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : isError ? (
            <div className="alert alert-error">
              <p role="alert">No pudimos cargar los concursos.</p>
              <button type="button" className="btn btn-sm" onClick={() => {
                resultsHeading.current?.focus();
                void refetch();
              }}>Reintentar</button>
            </div>
          ) : concursos.length === 0 ? (
            <EmptyState icon="search" heading="h3" />
          ) : (
            <ul role="list" className="listing-grid concursos-grid">
              {concursos.map((c) => <li key={c.id} className="min-w-0"><ConcursoCard concurso={c} destacarActivos /></li>)}
            </ul>
          )}
        </div>
      </section>

      <Pagination
        page={filters.page ?? 1}
        totalPages={totalPages}
        onPageChange={(p) => {
          resultsHeading.current?.focus();
          setFilter('page', p);
        }}
      />
    </div>
  );
}
