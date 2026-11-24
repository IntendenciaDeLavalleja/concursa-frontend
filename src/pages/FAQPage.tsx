import { FAQS } from '@/constants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { HelpCircle } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function FAQPage() {
  usePageTitle('Preguntas frecuentes');

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <Breadcrumbs items={[{ label: 'Preguntas Frecuentes' }]} />

      <header className="mt-4 mb-8 text-center">
        <div className="mx-auto mb-4 w-fit rounded-2xl bg-primary/10 p-4">
          <HelpCircle className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
        <h1 className="page-title">
          Preguntas Frecuentes
        </h1>
        <p className="mt-2 text-muted">
          Respuestas a las consultas más comunes sobre concursos y postulaciones
        </p>
      </header>

      <section aria-label="Preguntas y respuestas" className="space-y-3">
        {FAQS.map((faq, i) => (
          <details key={faq.pregunta} name="preguntas-frecuentes" open={i === 0}
            className="rounded-xl border border-base-300 bg-base-100">
            <summary className="min-h-11 cursor-pointer px-5 py-4 text-lg font-semibold">{faq.pregunta}</summary>
            <p className="px-5 pb-5 text-base leading-relaxed text-muted">{faq.respuesta}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
