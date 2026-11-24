import { FileText, ClipboardList, Files, UserCheck, Wrench, Mail, BookOpen } from 'lucide-react';
import type { Concurso } from '@/types';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

interface Props {
  concurso: Concurso;
}

export function ConcursoInfoPanel({ concurso }: Props) {
  return (
    <div className="space-y-6">
      {/* Description */}
      <InfoSection icon={FileText} title="Descripción">
        <div className="portal-document-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(concurso.descripcion) }} />
      </InfoSection>

      {concurso.requisitos_excluyentes && (
        <InfoSection icon={ClipboardList} title="Requisitos Excluyentes">
          <div className="portal-document-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(concurso.requisitos_excluyentes) }} />
        </InfoSection>
      )}

      {concurso.requisitos_valorados && (
        <InfoSection icon={ClipboardList} title="Requisitos Valorados">
          <div className="portal-document-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(concurso.requisitos_valorados) }} />
        </InfoSection>
      )}

      {concurso.perfil_buscado && (
        <InfoSection icon={UserCheck} title="Perfil Buscado">
          <div className="portal-document-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(concurso.perfil_buscado) }} />
        </InfoSection>
      )}

      {concurso.tareas_funciones && (
        <InfoSection icon={Wrench} title="Tareas y Funciones">
          <div className="portal-document-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(concurso.tareas_funciones) }} />
        </InfoSection>
      )}

      {concurso.documentacion_requerida && (
        <InfoSection icon={Files} title="Documentación requerida">
          <div className="portal-document-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(concurso.documentacion_requerida) }} />
        </InfoSection>
      )}

      {concurso.forma_postulacion && (
        <InfoSection icon={BookOpen} title="Forma de Postulación">
          <div className="portal-document-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(concurso.forma_postulacion) }} />
        </InfoSection>
      )}

      {concurso.contacto_consulta && (
        <InfoSection icon={Mail} title="Contacto para Consultas">
          <p className="text-sm text-muted">{concurso.contacto_consulta}</p>
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
