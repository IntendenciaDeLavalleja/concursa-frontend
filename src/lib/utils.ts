import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const CONCURSO_TIME_ZONE = 'America/Montevideo';

function concursoDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T12:00:00-03:00`);
  return new Date(/(?:Z|[+-]\d{2}:\d{2})$/.test(value) ? value : `${value}-03:00`);
}

export function formatDate(dateStr: string): string {
  return concursoDate(dateStr).toLocaleDateString('es-UY', {
    timeZone: CONCURSO_TIME_ZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateLong(dateStr: string): string {
  return concursoDate(dateStr).toLocaleDateString('es-UY', {
    timeZone: CONCURSO_TIME_ZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatConcursoDateTime(dateStr: string): string {
  return concursoDate(dateStr).toLocaleString('es-UY', {
    timeZone: CONCURSO_TIME_ZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function daysUntil(dateStr: string): number {
  const target = concursoDate(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}
