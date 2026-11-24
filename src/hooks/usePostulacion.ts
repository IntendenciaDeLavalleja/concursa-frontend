import { useMutation } from '@tanstack/react-query';
import { enviarPostulacion } from '@/services/postulaciones';
import type { PostulacionData } from '@/types';

export function usePostulacion() {
  return useMutation({
    mutationFn: ({ data, archivos }: { data: PostulacionData; archivos: Record<string, File | File[]> }) =>
      enviarPostulacion(data, archivos),
  });
}
