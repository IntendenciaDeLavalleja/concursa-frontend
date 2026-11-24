import { SearchX, PackageOpen } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  icon?: 'search' | 'empty';
  heading?: 'h1' | 'h2' | 'h3';
}

export function EmptyState({
  title = 'No se encontraron resultados',
  description = 'Intentá ajustar los filtros o la búsqueda.',
  icon = 'empty',
  heading: Heading = 'h2',
}: Props) {
  const Icon = icon === 'search' ? SearchX : PackageOpen;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-2xl bg-base-200 p-5">
        <Icon className="h-12 w-12 text-muted" aria-hidden="true" />
      </div>
      <Heading className={Heading === 'h1' ? 'page-title' : 'font-heading text-xl font-semibold'}>{title}</Heading>
      <p className="mt-2 max-w-md text-base text-muted">{description}</p>
    </div>
  );
}
