import { CONCURSO_ESTADOS, type ConcursoEstado, type FAQ } from '@/types';

export const APP_NAME = 'Lavalleja Concursa';
export const APP_DESCRIPTION = 'Portal de concursos públicos de la Intendencia de Lavalleja';

export const ESTADO_COLORS: Record<ConcursoEstado, { badge: string; dot: string }> = {
  abierto: { badge: 'badge-success', dot: 'bg-success' },
  en_proceso: { badge: 'badge-info', dot: 'bg-info' },
  finalizado: { badge: 'badge-neutral', dot: 'bg-neutral' },
  archivado: { badge: 'badge-ghost', dot: 'bg-base-300' },
  suspendido: { badge: 'badge-warning', dot: 'bg-warning' },
  proximo: { badge: 'badge-accent', dot: 'bg-accent' },
};

export const ESTADO_LABELS = CONCURSO_ESTADOS;

export const PER_PAGE_OPTIONS = [6, 12, 24] as const;

export const ACCEPTED_FILE_TYPES = {
  curriculum: '.pdf,.doc,.docx',
  cedula: '.pdf,.jpg,.jpeg,.png',
  certificados: '.pdf,.jpg,.jpeg,.png',
  constancias: '.pdf,.jpg,.jpeg,.png',
  adicional: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const FAQS: FAQ[] = [
  {
    pregunta: '¿Cómo me postulo a un concurso?',
    respuesta: 'Ingresá al concurso que te interesa, revisá los requisitos y plazos, y completá el formulario de postulación adjuntando la documentación solicitada antes de la fecha de cierre.',
  },
  {
    pregunta: '¿Qué documentación necesito para postularme?',
    respuesta: 'Generalmente se requiere cédula de identidad, currículum vitae, y certificados o constancias específicas según el cargo. Cada concurso detalla su documentación requerida.',
  },
  {
    pregunta: '¿Puedo postularme a más de un concurso a la vez?',
    respuesta: 'Sí, podés postularte a todos los concursos abiertos que desees, siempre que cumplas con los requisitos de cada uno.',
  },
  {
    pregunta: '¿Cómo sé el estado de mi postulación?',
    respuesta: 'Una vez enviada tu postulación, recibirás una confirmación por email. Los resultados se publican en este portal y se notifican según lo establezcan las bases.',
  },
  {
    pregunta: '¿Qué significa cada estado de concurso?',
    respuesta: '«Inscripciones abiertas» indica que el llamado recibe postulaciones por las vías de sus bases. «En selección» indica que cerraron las inscripciones y el trámite continúa. «Próximo» indica que el plazo está por comenzar, «Finalizado» que el trámite concluyó y «Suspendido» que se detuvo temporalmente. Los llamados archivados quedan disponibles para consulta.',
  },
  {
    pregunta: '¿Tienen costo las postulaciones?',
    respuesta: 'No. Todas las postulaciones a concursos públicos de la Intendencia de Lavalleja son completamente gratuitas.',
  },
];
