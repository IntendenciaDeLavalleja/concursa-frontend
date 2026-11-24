import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { useId, useRef, useState, type ReactNode } from 'react';
import { ESTADO_LABELS } from '@/constants';
import { useAreasConvocantes, useTiposContratacion, useTiposLlamado } from '@/hooks/useConcursos';
import { useFiltersStore } from '@/store/filtersStore';
import type { ConcursoEstado } from '@/types';

const estados: (ConcursoEstado | undefined)[] = [
  undefined, 'abierto', 'en_proceso', 'proximo', 'finalizado', 'suspendido', 'archivado',
];

const opcionesOrden = [
  { value: 'fecha_apertura_desc', label: 'Más recientes', sort_by: 'fecha_apertura', sort_order: 'desc' },
  { value: 'fecha_apertura_asc', label: 'Más antiguos', sort_by: 'fecha_apertura', sort_order: 'asc' },
  { value: 'fecha_cierre_asc', label: 'Fecha de cierre', sort_by: 'fecha_cierre', sort_order: 'asc' },
  { value: 'titulo_asc', label: 'Título de A a Z', sort_by: 'titulo', sort_order: 'asc' },
] as const;

export function FiltrosConcursos() {
  const { filters, setFilter, setFilters, resetFilters } = useFiltersStore();
  const { data: areas } = useAreasConvocantes();
  const { data: tipos } = useTiposContratacion();
  const { data: tiposLlamado } = useTiposLlamado();
  const [showFilters, setShowFilters] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const id = useId();

  const panelId = `${id}-filtros`;
  const searchId = `${id}-buscar`;
  const estadoHelpId = `${id}-estados`;
  const sortValue = `${filters.sort_by ?? 'fecha_apertura'}_${filters.sort_order ?? 'desc'}`;
  const activeFiltersCount = [
    filters.estado,
    filters.tipo_llamado_slug,
    filters.tipo_contratacion_id,
    filters.area_convocante_id,
  ].filter(Boolean).length;
  const hasCriteria = activeFiltersCount > 0 || Boolean(filters.search) || sortValue !== opcionesOrden[0].value;

  function clearCriteria() {
    resetFilters();
    searchInput.current?.focus();
  }

  function changeSort(value: string) {
    const option = opcionesOrden.find((item) => item.value === value);
    if (option) setFilters({ sort_by: option.sort_by, sort_order: option.sort_order });
  }

  return (
    <search aria-label="Filtros de concursos" className="concurso-filters">
      <div className="concurso-search-bar">
        <div className="concurso-search-field">
          <label htmlFor={searchId}>Buscar concursos</label>
          <div className="relative">
            <span className="concurso-search-icon" aria-hidden="true">
              <Search className="size-5" />
            </span>
            <input
              ref={searchInput}
              id={searchId}
              name="search"
              type="search"
              value={filters.search ?? ''}
              onChange={(event) => setFilter('search', event.target.value || undefined)}
              placeholder="Cargo, localidad o palabra clave"
              className="concurso-search-input"
            />
          </div>
        </div>
        <div className="concurso-filter-actions">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls={panelId}
            className="concurso-filter-toggle"
          >
            <SlidersHorizontal className="size-5 shrink-0" aria-hidden="true" />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <>
                <span className="concurso-filter-count" aria-hidden="true">{activeFiltersCount}</span>
                <span className="sr-only">, {activeFiltersCount} {activeFiltersCount === 1 ? 'activo' : 'activos'}</span>
              </>
            )}
            <ChevronDown className="concurso-filter-chevron size-4 shrink-0" aria-hidden="true" />
          </button>
          {hasCriteria && (
            <button type="button" onClick={clearCriteria} className="concurso-filter-reset">
              <X className="size-4 shrink-0" aria-hidden="true" />
              Limpiar búsqueda y filtros
            </button>
          )}
        </div>
      </div>

      <div id={panelId} hidden={!showFilters} className="concurso-filter-panel">
        <fieldset className="min-w-0" aria-describedby={estadoHelpId}>
          <legend className="concurso-filter-label">Estado del llamado</legend>
          <div className="concurso-filter-states">
            {estados.map((estado) => (
              <label key={estado ?? 'todos'} className="concurso-filter-state">
                <input
                  type="radio"
                  name={`${id}-estado`}
                  value={estado ?? ''}
                  checked={filters.estado === estado}
                  onChange={() => setFilter('estado', estado)}
                />
                <span>{estado ? ESTADO_LABELS[estado] : 'Todos'}</span>
              </label>
            ))}
          </div>
          <p id={estadoHelpId} className="mt-2 text-sm text-muted">
            «En selección» indica que cerraron las inscripciones y el llamado sigue en trámite.
          </p>
        </fieldset>
        <div className="concurso-filter-grid">
          <FiltroSelect
            name="tipo-llamado"
            label="Tipo de llamado"
            value={filters.tipo_llamado_slug ?? ''}
            onChange={(value) => setFilter('tipo_llamado_slug', value || undefined)}
          >
            <option value="">Todos los tipos</option>
            {tiposLlamado?.map((tipo) => <option key={tipo.id} value={tipo.slug}>{tipo.nombre}</option>)}
          </FiltroSelect>

          <FiltroSelect
            name="tipo-vinculo"
            label="Tipo de vínculo"
            value={filters.tipo_contratacion_id ?? ''}
            onChange={(value) => setFilter('tipo_contratacion_id', value ? Number(value) : undefined)}
          >
            <option value="">Todos los vínculos</option>
            {tipos?.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>)}
          </FiltroSelect>

          <FiltroSelect
            name="area-convocante"
            label="Área convocante"
            value={filters.area_convocante_id ?? ''}
            onChange={(value) => setFilter('area_convocante_id', value ? Number(value) : undefined)}
          >
            <option value="">Todas las áreas</option>
            {areas?.map((area) => <option key={area.id} value={area.id}>{area.nombre}</option>)}
          </FiltroSelect>

          <FiltroSelect name="orden" label="Ordenar por" value={sortValue} onChange={changeSort}>
            {opcionesOrden.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </FiltroSelect>
        </div>
      </div>
    </search>
  );
}

function FiltroSelect({ name, label, value, onChange, children }: {
  name: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="concurso-filter-field">
      <span className="concurso-filter-label">{label}</span>
      <select name={name} value={value} onChange={(event) => onChange(event.target.value)} className="concurso-filter-select">
        {children}
      </select>
    </label>
  );
}
