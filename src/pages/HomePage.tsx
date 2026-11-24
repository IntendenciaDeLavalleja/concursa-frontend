import { HeroConcursos } from '@/components/home/HeroConcursos';
import { ConcursosDestacados } from '@/components/home/ConcursosDestacados';
import { EstadisticasHome } from '@/components/home/EstadisticasHome';
import { AccesosRapidos } from '@/components/home/AccesosRapidos';
import { SeccionInstitucional } from '@/components/home/SeccionInstitucional';
import { CTASection } from '@/components/home/CTASection';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function HomePage() {
  usePageTitle('Inicio');

  return (
    <>
      <HeroConcursos />
      <EstadisticasHome />
      <ConcursosDestacados />
      <AccesosRapidos />
      <SeccionInstitucional />
      <CTASection />
    </>
  );
}
