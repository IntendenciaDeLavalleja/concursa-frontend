import { FileText, ClipboardList, Files, UserCheck, Wrench, Mail, BookOpen } from 'lucide-react';
import type { Concurso } from '@/types';
import { hasVisibleText, sanitizeHtml } from '@/lib/sanitizeHtml';

interface Props {
  concurso: Concurso;
}

const richTextSections = [
  { field: 'descripcion', icon: FileText, title: 'Descripción' },
  { field: 'requisitos_excluyentes', icon: ClipboardList, title: 'Requisitos Excluyentes' },
  { field: 'requisitos_valorados', icon: ClipboardList, title: 'Requisitos Valorados' },
  { field: 'perfil_buscado', icon: UserCheck, title: 'Perfil Buscado' },
  { field: 'tareas_funciones', icon: Wrench, title: 'Tareas y Funciones' },
  { field: 'documentacion_requerida', icon: Files, title: 'Documentación requerida' },
  { field: 'forma_postulacion', icon: BookOpen, title: 'Forma de Postulación' },
] as const;

export function ConcursoInfoPanel({ concurso }: Props) {
  const sectionsWithContent = richTextSections
    .map((section) => ({
      ...section,
      html: sanitizeHtml(concurso[section.field], { requireText: true }),
    }))
    .filter(({ html }) => Boolean(html));
  const contacto = concurso.contacto_consulta?.replaceAll('\u00a0', ' ').trim();
  const showContact = hasVisibleText(contacto);

  if (sectionsWithContent.length === 0 && !showContact) return null;

  return (
    <div className="space-y-6">
      {sectionsWithContent.map(({ field, icon, title, html }) => (
        <InfoSection key={field} icon={icon} title={title}>
          <div className="portal-document-content" dangerouslySetInnerHTML={{ __html: html }} />
        </InfoSection>
      ))}

      {showContact && (
        <InfoSection icon={Mail} title="Contacto para Consultas">
          <p className="portal-document-content text-sm text-muted">{contacto}</p>
        </InfoSection>
      )}
    </div>
  );
}

function InfoSection({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="card bg-base-100 border border-base-300/50">
      <div className="card-body p-5">
        <h2 className="flex items-center gap-2 font-heading text-xl font-semibold">
          <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          {title}
        </h2>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
