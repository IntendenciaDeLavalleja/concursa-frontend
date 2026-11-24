import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';

interface Crumb {
  label: string;
  to?: string;
}

interface Props {
  items?: Crumb[];
}

export function Breadcrumbs({ items }: Props) {
  const location = useLocation();

  const autoItems: Crumb[] = items ?? generateFromPath(location.pathname);

  return (
    <nav className="breadcrumbs text-sm" aria-label="Ruta de navegación">
      <ol>
        <li>
          <Link to="/" className="gap-1.5 text-muted hover:text-primary transition-colors">
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            Inicio
          </Link>
        </li>
        {autoItems.map((crumb, i) => (
          <li key={i}>
            {crumb.to ? (
              <Link to={crumb.to} className="text-muted hover:text-primary transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current={i === autoItems.length - 1 ? 'page' : undefined} className="font-medium">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function generateFromPath(pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean);
  const labels: Record<string, string> = {
    concursos: 'Concursos',
    postulacion: 'Postulación',
    faq: 'Preguntas Frecuentes',
  };

  return segments.map((seg, i) => ({
    label: labels[seg] ?? decodeURIComponent(seg),
    to: i < segments.length - 1 ? '/' + segments.slice(0, i + 1).join('/') : undefined,
  }));
}
