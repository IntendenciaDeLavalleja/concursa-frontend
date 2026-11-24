import { Link } from 'react-router-dom';
import { ArrowRight, Tags } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Animations';
import { useTiposLlamado } from '@/hooks/useConcursos';

export function AccesosRapidos() {
  const { data: tipos } = useTiposLlamado();
  if (!tipos?.length) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <FadeIn>
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">Explorá por tipo de llamado</h2>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {tipos.map(({ id, slug, nombre, descripcion }) => (
            <StaggerItem key={id}>
              <Link
                to={`/concursos?tipo=${encodeURIComponent(slug)}`}
                className="card bg-base-100 border border-base-300/50 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="card-body p-5 items-center text-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Tags className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-sm wrap-anywhere group-hover:text-primary transition-colors">{nombre}</h3>
                  {descripcion && <p className="text-xs text-muted leading-relaxed wrap-anywhere">{descripcion}</p>}
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-1" aria-hidden="true" />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
