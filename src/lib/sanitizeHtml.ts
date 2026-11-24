import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string | undefined | null) {
  return DOMPurify.sanitize(html ?? '');
}