import { Shield, Scale, Eye, Heart } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Animations';

const VALORES = [
  { icon: Shield, title: 'Transparencia', desc: 'Todos los procesos son públicos y auditables.' },
  { icon: Scale, title: 'Igualdad', desc: 'Acceso equitativo para toda la ciudadanía.' },
  { icon: Eye, title: 'Publicidad', desc: 'Información completa y actualizada siempre disponible.' },
  { icon: Heart, title: 'Compromiso', desc: 'Con la vocación de servicio público departamental.' },
];

export function SeccionInstitucional() {
  return (
    <section className="py-16 bg-base-200/30">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">
              Compromiso con la Ciudadanía
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              La Intendencia de Lavalleja garantiza procesos de selección abiertos, transparentes
              y respetuosos de los principios de igualdad de oportunidades y mérito.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALORES.map(({ icon: Icon, title, desc }) => (
            <StaggerItem key={title}>
              <div className="card bg-base-100 border border-base-300/50 h-full">
                <div className="card-body items-center text-center gap-3 p-6">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold">{title}</h3>
                  <p className="text-sm text-muted">{desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
