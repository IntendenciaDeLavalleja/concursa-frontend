import { Link, NavLink, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { AccessibilityDialog } from './AccessibilityDialog';
import { Menu, X } from 'lucide-react';
import { useRef, useState, type KeyboardEvent } from 'react';
import { APP_NAME } from '@/constants';
import logo from '@/assets/Logo.webp';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/concursos', label: 'Concursos' },
  { to: '/seguimiento', label: 'Seguimiento de Trámite' },
  { to: '/faq', label: 'Preguntas Frecuentes' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  const dismissMenu = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Escape' || !mobileOpen) return;
    setMobileOpen(false);
    mobileToggle.current?.focus();
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `btn btn-ghost btn-sm font-medium ${isActive ? 'bg-primary/10 text-primary underline underline-offset-4' : ''}`;

  return (
    <header className="site-header z-50 w-full border-b border-base-300 bg-base-100">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-2 px-4 py-2 lg:px-8">
        <Link to="/" aria-label={APP_NAME} onClick={() => setMobileOpen(false)}
          className="flex min-h-11 min-w-0 items-center gap-2.5 text-lg font-bold tracking-tight text-primary">
          <img src={logo} alt="" className="h-9 w-auto max-w-full object-contain" />
          <span className="hidden sm:inline font-heading">{APP_NAME}</span>
        </Link>

        <nav aria-label="Principal" className="desktop-navigation hidden min-[84rem]:block">
          <ul className="flex flex-wrap items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end className={linkClass}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <AccessibilityDialog />
          <ThemeToggle />
          <button
            ref={mobileToggle}
            type="button"
            className="menu-toggle btn btn-ghost nav-icon-button min-[84rem]:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            onKeyDown={dismissMenu}
            aria-label="Menú"
            aria-expanded={mobileOpen}
            aria-controls="menu-principal"
          >
            {mobileOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav id="menu-principal" aria-label="Principal" hidden={!mobileOpen} onKeyDown={dismissMenu}
        className="mobile-navigation border-t border-base-300 min-[84rem]:hidden">
        <ul className="flex flex-col gap-1 p-4">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end className={(state) => `${linkClass(state)} w-full justify-start`}
                onClick={() => {
                  setMobileOpen(false);
                  if (link.to === pathname) mobileToggle.current?.focus();
                }}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
