export const CONCURSO_ESTADOS = {
  abierto: 'Inscripciones abiertas',
  en_proceso: 'En selección',
  finalizado: 'Finalizado',
  archivado: 'Archivado',
  suspendido: 'Suspendido',
  proximo: 'Próximo',
} as const;

export type ConcursoEstado = keyof typeof CONCURSO_ESTADOS;

export interface AreaConvocante {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface TipoContratacion {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface TipoLlamado {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
}

export interface ConcursoTimeline {
  fecha: string;
  titulo: string;
  descripcion?: string;
  completado: boolean;
}

export interface ConcursoDocumento {
  id: string;
  nombre: string;
  slug?: string;
  url?: string | null;
  download_url?: string | null;
  tipo: string;
  kind: 'page' | 'external' | 'postulacion';
}

export interface ConcursoActualizacion {
  id: number;
  etapa: string;
  titulo: string;
  fecha: string;
  descripcion?: string | null;
  pdf_url?: string | null;
}

export interface Concurso {
  id: number;
  titulo: string;
  subtitulo?: string;
  slug: string;
  estado: ConcursoEstado;
  ms_hasta_cambio_estado?: number | null;
  area_convocante: AreaConvocante;
  tipo_contratacion: TipoContratacion;
  tipo_llamado?: TipoLlamado | null;
  cantidad_cargos: number;
  remuneracion?: string;
  localidad?: string;
  fecha_apertura: string;
  fecha_cierre: string;
  fecha_resolucion_estimada?: string;
  descripcion: string;
  requisitos_excluyentes?: string;
  requisitos_valorados?: string;
  perfil_buscado?: string;
  tareas_funciones?: string;
  documentacion_requerida?: string;
  forma_postulacion?: string;
  contacto_consulta?: string;
  normativa?: string;
  bases_url?: string;
  documentos_contenido?: Record<string, string>;
  postulacion_web_habilitada?: boolean;
  requiere_18_anos?: boolean;
  timeline?: ConcursoTimeline[];
  documentos?: ConcursoDocumento[];
  actualizaciones?: ConcursoActualizacion[];
  created_at: string;
  updated_at: string;
}

export interface ConcursoListItem {
  id: number;
  titulo: string;
  subtitulo?: string;
  slug: string;
  estado: ConcursoEstado;
  ms_hasta_cambio_estado?: number | null;
  area_convocante: string;
  tipo_contratacion: string;
  tipo_llamado?: string;
  tipo_llamado_slug?: string | null;
  cantidad_cargos: number;
  remuneracion?: string;
  localidad?: string;
  fecha_apertura: string;
  fecha_cierre: string;
}

export interface PostulacionData {
  nombre_completo: string;
  documento: string;
  fecha_nacimiento: string;
  email: string;
  telefono: string;
  domicilio: string;
  localidad: string;
  concurso_id: number;
  observaciones?: string;
}

export interface PostulacionArchivos {
  curriculum?: File;
  cedula?: File;
  certificados?: File[];
  constancias?: File[];
  adicional?: File[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface ConcursoFilters {
  search?: string;
  estado?: ConcursoEstado;
  tipo_contratacion_id?: number;
  tipo_llamado_slug?: string;
  area_convocante_id?: number;
  sort_by?: 'fecha_apertura' | 'fecha_cierre' | 'titulo';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface EstadisticasConcursos {
  abiertos: number;
  en_proceso: number;
  finalizados: number;
  archivados: number;
  postulaciones_en_curso: number;
}

export interface FAQ {
  pregunta: string;
  respuesta: string;
}
