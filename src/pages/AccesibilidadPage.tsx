import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AccesibilidadPage() {
  usePageTitle('Accesibilidad');

  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-8 leading-relaxed lg:px-8">
      <Breadcrumbs items={[{ label: 'Accesibilidad' }]} />
      <h1 className="page-title">Accesibilidad</h1>
      <p>
        Lavalleja Concursa toma como referencia las pautas de accesibilidad web WCAG 2.2 de nivel A y AA.{' '}
        <a className="link link-primary" href="https://www.gub.uy/agencia-gobierno-electronico-sociedad-informacion-conocimiento/comunicacion/publicaciones/requisitos-tecnicos-accesibilidad-digital/requisitos-tecnicos">
          Requisitos técnicos de accesibilidad digital de Agesic
        </a>
      </p>

      <section className="space-y-2">
        <h2 className="font-heading text-xl font-bold">Ajustes de lectura</h2>
        <ul className="list-disc space-y-2 ps-6">
          <li>En <strong>Accesibilidad</strong>, en el encabezado, podés ampliar el texto hasta el 200 %, restablecerlo y reducir el movimiento.</li>
          <li>Al comenzar a navegar con Tab, usá <strong>Saltar al contenido</strong> para ir directamente a la información de la página.</li>
          <li>Podés usar el zoom del navegador y navegar las secciones y los formularios con el teclado.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl font-bold">Comunicar una barrera</h2>
        <p>
          Si encontrás una dificultad para consultar un llamado, completar un trámite o leer un documento,
          contanos qué estabas intentando hacer e incluí el enlace de la página. Escribinos a{' '}
          <a className="link link-primary" href="mailto:info@lavalleja.gub.uy">info@lavalleja.gub.uy</a>.
        </p>
        <p>
          <a className="link link-primary" href="https://www.gub.uy/intendencia-lavalleja/declaracion-accesibilidad">
            Declaración de accesibilidad de la Intendencia de Lavalleja
          </a>
        </p>
      </section>
    </article>
  );
}
