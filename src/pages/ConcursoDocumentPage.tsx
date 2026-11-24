import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonList } from '@/components/ui/Skeleton';
import { useConcurso } from '@/hooks/useConcursos';
import { usePageTitle } from '@/hooks/usePageTitle';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { apiResourceUrl } from '@/services/api';
import { Download, FileText, Printer } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

function normalizeDocumentName(name: string) {
  return /declaraci[oó]n jurada/i.test(name) ? 'Resolución' : name;
}

export default function ConcursoDocumentPage() {
  const { slug, documentoSlug } = useParams<{ slug: string; documentoSlug: string }>();
  const { data: concurso, isLoading, error } = useConcurso(slug ?? '');
  const documento = concurso?.documentos?.find((item) => item.slug === documentoSlug && item.kind === 'page');
  const contenido = documentoSlug ? concurso?.documentos_contenido?.[documentoSlug] : undefined;
  const documentName = documento ? normalizeDocumentName(documento.nombre) : 'Documento';
  usePageTitle(concurso && documento ? documentName + ' · ' + concurso.titulo : 'Documento del concurso');

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <SkeletonList lines={8} />
      </div>
    );
  }

  if (error && !concurso) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <EmptyState heading="h1" title="Concurso no encontrado" description="El concurso que buscás no existe o fue removido." />
      </div>
    );
  }

  if (!concurso || !documento || !contenido) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Concursos', to: '/concursos' },
            ...(concurso ? [{ label: concurso.titulo, to: `/concursos/${concurso.slug}` }] : []),
            { label: 'Documento' },
          ]}
        />

        <EmptyState
          heading="h1"
          title="Documento no disponible"
          description="Este documento no fue publicado para el concurso seleccionado o ya no está disponible."
        />

        <div className="flex justify-center">
          <Link to={concurso ? `/concursos/${concurso.slug}` : '/concursos'} className="btn btn-primary">
            {concurso ? 'Volver al concurso' : 'Ver concursos'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="document-page mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Concursos', to: '/concursos' },
          { label: concurso.titulo, to: `/concursos/${concurso.slug}` },
          { label: documentName },
        ]}
      />

      <div className="mt-6 space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary">
            <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
            Documento del concurso
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="page-title">{documentName}</h1>
              <p className="mt-2 text-muted">{concurso.titulo}</p>
            </div>

            <div className="document-actions flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-outline gap-2"
              >
                <Printer className="size-4" aria-hidden="true" />
                Imprimir o guardar como PDF
              </button>

              {documento.download_url && (
                <a
                  href={apiResourceUrl(documento.download_url)}
                  className="btn btn-ghost gap-2"
                >
                  Descargar PDF oficial
                  <Download className="size-4" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>

        <article className="card border border-base-300/50 bg-base-100 shadow-sm">
          <div className="card-body p-4 sm:p-8">
            <div
              className="portal-document-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(contenido) }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
