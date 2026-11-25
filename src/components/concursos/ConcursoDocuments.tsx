import { FileDown, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiResourceUrl } from '@/services/api';
import type { ConcursoDocumento } from '@/types';

function normalizeDocumentName(name: string) {
  return /declaraci[oó]n jurada/i.test(name) ? 'Resolución' : name;
}

interface Props {
  documentos: ConcursoDocumento[];
  concursoSlug: string;
}

export function ConcursoDocuments({ documentos, concursoSlug }: Props) {
  const documentosDisponibles = documentos.filter((doc) => doc.kind === 'postulacion' || Boolean(doc.download_url));
  if (documentosDisponibles.length === 0) return null;

  return (
    <div className="card bg-base-100 border border-base-300/50">
      <div className="card-body p-5">
        <h2 className="mb-3 flex items-center gap-2 font-heading text-xl font-semibold">
          <FileText className="size-5 shrink-0 text-primary" aria-hidden="true" />
          Documentos disponibles
        </h2>

        <ul role="list" className="space-y-2">
          {documentosDisponibles.map((doc) => {
            const documentName = normalizeDocumentName(doc.nombre);
            const isPrimary = doc.id === 'bases-concurso';
            const postula = doc.kind === 'postulacion';
            const page = doc.kind === 'page' && doc.slug;
            const descargaDirecta = doc.url?.startsWith('/api/concursos/');
            const portalLink = postula ? `/concursos/${concursoSlug}/postulacion` : page
              ? `/concursos/${concursoSlug}/documentos/${doc.slug}` : undefined;
            const classes = [
              'flex items-center gap-3 rounded-lg p-3 transition-colors group',
              isPrimary
                ? 'border border-primary/20 bg-primary/5 hover:bg-primary/10'
                : 'border border-base-300/50 hover:bg-base-200/50',
            ].join(' ');
            const subtitle = postula ? 'Formulario de postulación' : page ? 'Documento en el portal'
              : descargaDirecta ? 'Descargar PDF oficial'
              : doc.url ? 'Archivo oficial. Se abre en otra pestaña.' : 'Archivo no disponible';
            const contents = (
              <>
                <span className={`shrink-0 rounded-lg p-2 ${isPrimary ? 'bg-primary/10 text-primary' : 'bg-base-200 text-muted'}`}>
                  <FileDown className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium group-hover:text-primary">{documentName}</span>
                  <span className="block text-xs text-muted">{subtitle}</span>
                </span>
              </>
            );

            return (
              <li key={doc.id}>
                {portalLink ? <Link to={portalLink} className={classes}>{contents}</Link>
                  : doc.url ? <a href={apiResourceUrl(doc.url)} target={descargaDirecta ? undefined : '_blank'} rel="noopener noreferrer" className={classes}>{contents}</a>
                  : <div className={classes}>{contents}</div>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
