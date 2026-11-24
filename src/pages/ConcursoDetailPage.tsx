import { useParams, Link } from 'react-router-dom';
import { useConcurso } from '@/hooks/useConcursos';
import { usePageTitle } from '@/hooks/usePageTitle';
import { ConcursoDetailHeader } from '@/components/concursos/ConcursoDetailHeader';
import { ConcursoInfoPanel } from '@/components/concursos/ConcursoInfoPanel';
import { ConcursoTimeline } from '@/components/concursos/ConcursoTimeline';
import { ConcursoDocuments } from '@/components/concursos/ConcursoDocuments';
import { ConcursoActualizaciones } from '@/components/concursos/ConcursoActualizaciones';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { SkeletonList } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

export default function ConcursoDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: concurso, isLoading } = useConcurso(slug ?? '');
  usePageTitle(concurso?.titulo ?? 'Detalle de concurso');

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <SkeletonList lines={8} />
      </div>
    );
  }

  if (!concurso) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <EmptyState heading="h1" title="Concurso no encontrado" description="El concurso que buscás no existe o fue removido." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Concursos', to: '/concursos' },
          { label: concurso.titulo },
        ]}
      />

      <motion.div
        data-motion
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 space-y-8"
      >
        <ConcursoDetailHeader concurso={concurso} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="min-w-0 space-y-6 xl:col-span-2">
            <ConcursoActualizaciones actualizaciones={concurso.actualizaciones ?? []} />
            <ConcursoInfoPanel concurso={concurso} />
          </div>
          <div className="min-w-0 space-y-6">
            {concurso.estado === 'abierto' && concurso.postulacion_web_habilitada && (
              <Link
                to={`/concursos/${concurso.slug}/postulacion`}
                className="btn btn-primary w-full gap-2"
              >
                Postularse a este concurso
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
            {concurso.postulacion_web_habilitada && (
              <Link className="btn btn-ghost w-full" to={`/concursos/${concurso.slug}/postulacion#reenviar-confirmacion`}>
                Reenviar confirmación de correo
              </Link>
            )}
            {concurso.timeline && <ConcursoTimeline timeline={concurso.timeline} />}
            <ConcursoDocuments documentos={concurso.documentos ?? []} concursoSlug={concurso.slug} />
          </div>
        </div>

        {concurso.normativa && (
          <div className="card bg-base-200/50 border border-base-300/50">
            <div className="card-body p-4">
              <h2 className="font-heading text-xl font-semibold">Normativa</h2>
              <div className="portal-document-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(concurso.normativa) }} />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
