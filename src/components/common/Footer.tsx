import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '@/constants';
import logo from '@/assets/Logo.webp';

export function Footer() {
  return (
    <footer className="border-t border-base-300/50 bg-base-200/50">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-lg">
              <img src={logo} alt="" className="h-8 w-auto" />
              <span className="font-heading">{APP_NAME}</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Portal oficial de concursos públicos de la Intendencia Departamental de Lavalleja.
              Transparencia, igualdad y acceso a oportunidades.
            </p>
          </div>

          {/* Links */}
          <nav aria-labelledby="navegacion-pie">
            <h2 id="navegacion-pie" className="font-heading font-semibold text-sm uppercase tracking-wider text-muted mb-3">Enlaces del portal</h2>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link to="/concursos" className="text-sm hover:text-primary transition-colors">Concursos</Link></li>
              <li><Link to="/seguimiento" className="text-sm hover:text-primary transition-colors">Seguimiento de Trámite</Link></li>
              <li><Link to="/faq" className="text-sm hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link to="/accesibilidad" className="text-sm underline underline-offset-4 hover:text-primary transition-colors">Accesibilidad</Link></li>
            </ul>
          </nav>

          {/* Legal */}
          <div>
            <h2 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted mb-3">Institucional</h2>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted">Intendencia de Lavalleja</span></li>
              <li><span className="text-sm text-muted">Dirección de RRHH</span></li>
              <li><span className="text-sm text-muted">Transparencia Pública</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted mb-3">Contacto</h2>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-muted">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Minas, Lavalleja, Uruguay</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted">
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>4442 2752-4442 3715</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted">
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a href="mailto:concursos@lavalleja.gub.uy" className="link link-primary">concursos@lavalleja.gub.uy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider my-6" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Intendencia Departamental de Lavalleja. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted">
            Plataforma desarrollada con compromiso de transparencia y acceso democrático.
          </p>
        </div>
      </div>
    </footer>
  );
}
