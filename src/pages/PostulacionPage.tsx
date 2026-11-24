import { PostulacionForm } from '@/components/postulaciones/PostulacionForm';
import { ReenviarConfirmacion } from '@/components/postulaciones/ReenviarConfirmacion';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonList } from '@/components/ui/Skeleton';
import { useConcurso } from '@/hooks/useConcursos';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Link, useLocation, useParams } from 'react-router-dom';

export default function PostulacionPage() {
  const { slug } = useParams<{ slug: string }>();
  const { hash } = useLocation();
  const { data: concurso, isLoading } = useConcurso(slug ?? '');
  const puedeInscribirse = concurso?.estado === 'abierto' && !!concurso.postulacion_web_habilitada;
  usePageTitle(concurso ? `Postulación a ${concurso.titulo}` : 'Formulario de postulación');

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <SkeletonList lines={6} />
      </div>
    );
  }

  if (!concurso) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <Breadcrumbs items={[{ label: 'Postulación' }]} />

        <EmptyState
          heading="h1"
          title="Concurso no encontrado"
          description="El llamado al que intentás postularte no existe o ya no está disponible."
        />

        <div className="flex justify-center">
          <Link to="/concursos" className="btn btn-primary">
            Ver concursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Concursos', to: '/concursos' },
          { label: concurso.titulo, to: `/concursos/${concurso.slug}` },
          { label: 'Postulación' },
        ]}
      />

      <PostulacionForm
        key={concurso.id}
        concursoId={concurso.id}
        concursoTitulo={concurso.titulo}
        requiere18Anos={concurso.requiere_18_anos}
        puedeInscribirse={puedeInscribirse}
        contenidoBloqueado={(
          <>
            <EmptyState
              heading="h1"
              title="Postulación no disponible"
              description="La inscripción web requiere un llamado abierto con el formulario habilitado."
            />
            <div className="flex justify-center">
              <Link to={`/concursos/${concurso.slug}`} className="btn btn-primary">
                Volver al concurso
              </Link>
            </div>
          </>
        )}
      />
      {concurso.postulacion_web_habilitada && (
        <ReenviarConfirmacion concursoId={concurso.id} mostrar={hash === '#reenviar-confirmacion'} puedeInscribirse={puedeInscribirse} />
      )}
    </div>
  );
}
