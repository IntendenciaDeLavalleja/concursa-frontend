import { useQuery } from '@tanstack/react-query';
import {
  getConcursos,
  getConcursoBySlug,
  getEstadisticas,
  getAreasConvocantes,
  getTiposContratacion,
  getTiposLlamado,
  getConcursosDestacados,
} from '@/services/concursos';
import type { ConcursoFilters, ConcursoListItem } from '@/types';

const REFRESCO_ESTADO_MS = 60_000;
const REFRESCO_MINIMO_MS = 500;
const CONSULTAR_ESTADO = {
  refetchOnMount: 'always',
  refetchOnWindowFocus: 'always',
  refetchIntervalInBackground: false,
} as const;
const CONSULTAR_CATALOGO = {
  refetchOnMount: 'always',
  refetchOnWindowFocus: true,
} as const;

function intervaloPorPlazo(
  recibidoEn: number,
  llamados: readonly (Pick<ConcursoListItem, 'ms_hasta_cambio_estado'> | undefined)[],
) {
  const transcurrido = Math.max(0, Date.now() - recibidoEn);
  let intervalo = REFRESCO_ESTADO_MS;
  for (const llamado of llamados) {
    const hastaCambio = llamado?.ms_hasta_cambio_estado;
    if (hastaCambio == null) continue;
    const restante = hastaCambio - transcurrido;
    if (restante >= -REFRESCO_MINIMO_MS) {
      intervalo = Math.min(intervalo, Math.max(REFRESCO_MINIMO_MS, restante));
    }
  }
  return intervalo;
}

export function useConcursos(filters: ConcursoFilters) {
  return useQuery({
    ...CONSULTAR_ESTADO,
    queryKey: ['concursos', filters],
    queryFn: () => getConcursos(filters),
    placeholderData: (prev) => prev,
    refetchInterval: ({ state }) => intervaloPorPlazo(state.dataUpdatedAt, state.data?.items ?? []),
  });
}

export function useConcurso(slug: string) {
  return useQuery({
    ...CONSULTAR_ESTADO,
    queryKey: ['concurso', slug],
    queryFn: () => getConcursoBySlug(slug),
    enabled: !!slug,
    refetchInterval: ({ state }) => intervaloPorPlazo(state.dataUpdatedAt, [state.data]),
  });
}

export function useEstadisticas() {
  return useQuery({
    ...CONSULTAR_ESTADO,
    queryKey: ['estadisticas'],
    queryFn: getEstadisticas,
    staleTime: REFRESCO_ESTADO_MS,
    refetchInterval: REFRESCO_ESTADO_MS,
  });
}

export function useAreasConvocantes() {
  return useQuery({
    ...CONSULTAR_CATALOGO,
    queryKey: ['areas-convocantes'],
    queryFn: getAreasConvocantes,
  });
}

export function useTiposContratacion() {
  return useQuery({
    ...CONSULTAR_CATALOGO,
    queryKey: ['tipos-contratacion'],
    queryFn: getTiposContratacion,
  });
}

export function useTiposLlamado() {
  return useQuery({
    ...CONSULTAR_CATALOGO,
    queryKey: ['tipos-llamado'],
    queryFn: getTiposLlamado,
  });
}

export function useConcursosDestacados() {
  return useQuery({
    ...CONSULTAR_ESTADO,
    queryKey: ['concursos-destacados'],
    queryFn: getConcursosDestacados,
    staleTime: REFRESCO_ESTADO_MS,
    refetchInterval: ({ state }) => intervaloPorPlazo(state.dataUpdatedAt, state.data ?? []),
  });
}
