import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          data-motion
          initial={{ scale: 0.97 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card bg-primary text-primary-content shadow-xl"
        >
          <div className="card-body items-center text-center py-14 px-6 sm:px-12">
            <div className="rounded-2xl bg-white/10 p-4 mb-2">
              <FileText className="h-10 w-10" />
            </div>
            <h2 className="card-title font-heading text-2xl sm:text-3xl font-bold">
              ¿Listo para postularte?
            </h2>
            <p className="max-w-lg mt-2 leading-relaxed">
              Revisá los concursos abiertos, prepará tu documentación y completá tu postulación
              de forma simple y 100% digital.
            </p>
            <div className="card-actions mt-6 gap-3">
              <Link
                to="/concursos"
                className="btn border-0 bg-base-100 text-primary hover:bg-base-200 gap-2"
              >
                Ver Concursos
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/faq"
                className="btn btn-ghost border border-current text-primary-content hover:bg-primary-content/10"
              >
                Preguntas Frecuentes
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
