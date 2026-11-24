import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function HeroConcursos() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/concursos?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/concursos');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-accent/3 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-[max(16px,min(4vw,1rem))] py-10 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            data-motion
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="badge badge-primary badge-outline badge-lg mb-4 gap-2 text-base font-semibold sm:text-3xl">
              <span className="h-3 w-3 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              Intendencia de Lavalleja
            </span>

            <h1 className="text-balance font-heading text-[1.75rem] font-extrabold tracking-tight min-[24rem]:text-4xl sm:text-5xl lg:text-6xl">
              <span className="text-base-content">Lavalleja </span>
              <span className="text-primary">
                Concursa
              </span>
            </h1>

            <p className="mt-5 text-lg text-muted leading-relaxed sm:text-xl">
              Accedé a todas las oportunidades laborales de la Intendencia de Lavalleja.
              Transparencia, igualdad y acceso democrático al servicio público.
            </p>
          </motion.div>

          <search aria-label="Concursos" className="mx-auto mt-8 max-w-xl text-start">
            <form onSubmit={handleSearch} action="/concursos">
              <label htmlFor="buscar-portada" className="mb-3 block text-lg font-semibold">Buscar concursos</label>
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                <input
                  id="buscar-portada"
                  name="search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Título, cargo o área"
                  className="input w-full bg-base-100"
                />
                <button type="submit" className="btn btn-primary px-6">
                  <Search className="size-4" aria-hidden="true" /> Buscar
                </button>
              </div>
            </form>
          </search>

          {/* Quick stats */}
          <motion.div
            data-motion
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted"
          >
            <span>Concursos activos disponibles</span>
            <span className="h-1 w-1 rounded-full bg-base-content/20" />
            <span>Postulación gratuita</span>
            <span className="hidden sm:inline h-1 w-1 rounded-full bg-base-content/20" />
            <span className="hidden sm:inline">100% digital</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
