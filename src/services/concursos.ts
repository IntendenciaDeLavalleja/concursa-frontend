import { api } from './api';
import type {
  Concurso,
  ConcursoListItem,
  ConcursoFilters,
  PaginatedResponse,
  EstadisticasConcursos,
  AreaConvocante,
  TipoContratacion,
  TipoLlamado,
} from '@/types';

export async function getConcursos(
  filters: ConcursoFilters = {}
): Promise<PaginatedResponse<ConcursoListItem>> {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.estado) params.set('estado', filters.estado);
  if (filters.tipo_contratacion_id) params.set('tipo_contratacion_id', String(filters.tipo_contratacion_id));
  if (filters.tipo_llamado_slug) params.set('tipo_llamado', filters.tipo_llamado_slug);
  if (filters.area_convocante_id) params.set('area_convocante_id', String(filters.area_convocante_id));
  if (filters.sort_by) params.set('sort_by', filters.sort_by);
  if (filters.sort_order) params.set('sort_order', filters.sort_order);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.per_page) params.set('per_page', String(filters.per_page));

  const { data } = await api.get<PaginatedResponse<ConcursoListItem>>(
    `/concursos/?${params.toString()}`
  );
  return data;
}

export async function getConcursoBySlug(slug: string): Promise<Concurso> {
  const { data } = await api.get<Concurso>(`/concursos/${slug}`);
  return data;
}

export async function getEstadisticas(): Promise<EstadisticasConcursos> {
  const { data } = await api.get<EstadisticasConcursos>('/concursos/estadisticas');
  return data;
}

export async function getAreasConvocantes(): Promise<AreaConvocante[]> {
  const { data } = await api.get<AreaConvocante[]>('/concursos/areas');
  return data;
}

export async function getTiposContratacion(): Promise<TipoContratacion[]> {
  const { data } = await api.get<TipoContratacion[]>('/concursos/tipos-contratacion');
  return data;
}

export async function getTiposLlamado(): Promise<TipoLlamado[]> {
  const { data } = await api.get<TipoLlamado[]>('/concursos/tipos-llamado');
  return data;
}

export async function getConcursosDestacados(): Promise<ConcursoListItem[]> {
  const { data } = await api.get<ConcursoListItem[]>('/concursos/destacados');
  return data;
}
