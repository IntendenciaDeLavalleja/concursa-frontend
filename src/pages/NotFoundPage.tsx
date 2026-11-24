import { Link } from 'react-router-dom';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Página no encontrada');

  return (
    <div className="mx-auto max-w-3xl px-4 pb-12 text-center">
      <EmptyState heading="h1" title="No encontramos la página" description="Revisá la dirección o volvé al inicio del portal." />
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </div>
  );
}
