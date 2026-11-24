import { api } from './api';
import type { PostulacionData } from '@/types';

export interface PostulacionPreinscripcionResponse {
  message: string;
  id: number;
  email: string;
  verification_required: boolean;
  verification_email_sent: boolean;
}

export interface PostulacionVerificacionResponse {
  message: string;
  tracking_code: string;
  concurso_titulo: string;
  already_verified: boolean;
  completion_email_sent: boolean;
}

export interface PostulacionDuplicadoResponse {
  duplicate_email: boolean;
  duplicate_documento: boolean;
  errors: string[];
}

export async function enviarPostulacion(
  data: PostulacionData,
  archivos: Record<string, File | File[]>
): Promise<PostulacionPreinscripcionResponse> {
  const formData = new FormData();

  // Add text fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  // Add files
  Object.entries(archivos).forEach(([key, files]) => {
    if (Array.isArray(files)) {
      files.forEach((file) => formData.append(key, file));
    } else if (files) {
      formData.append(key, files);
    }
  });

  const { data: response } = await api.post<PostulacionPreinscripcionResponse>(
    '/concursos/postulaciones',
    formData,
    { timeout: 180_000 },
  );
  return response;
}


export async function verificarPostulacionEmail(
  uid: string,
  token: string
): Promise<PostulacionVerificacionResponse> {
  const { data } = await api.post<PostulacionVerificacionResponse>(
    '/concursos/postulaciones/verificar-email',
    new URLSearchParams({ uid, token }),
    { timeout: 45_000 },
  );
  return data;
}


export async function verificarPostulacionDuplicada(params: {
  concursoId: number;
  email?: string;
  documento?: string;
}): Promise<PostulacionDuplicadoResponse> {
  const searchParams = new URLSearchParams({
    concurso_id: String(params.concursoId),
  });

  if (params.email) {
    searchParams.set('email', params.email.trim().toLowerCase());
  }

  if (params.documento) {
    searchParams.set('documento', params.documento.trim());
  }

  const { data } = await api.post<PostulacionDuplicadoResponse>(
    '/concursos/postulaciones/verificar-duplicado',
    searchParams,
  );
  return data;
}

export interface ConfirmacionIdentidad {
  concursoId: number;
  email: string;
  documento: string;
}

export async function reenviarConfirmacion({ concursoId, email, documento }: ConfirmacionIdentidad) {
  const { data } = await api.post<{ message: string }>(
    '/concursos/postulaciones/reenviar-confirmacion',
    new URLSearchParams({ concurso_id: String(concursoId), email, documento }),
    { timeout: 45_000 },
  );
  return data;
}
