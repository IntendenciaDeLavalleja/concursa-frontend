import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useLayoutEffect, useRef } from 'react';
import { MotionConfig } from 'framer-motion';
import { useAccessibilityStore } from '@/store/accessibilityStore';

export function MainLayout() {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  const main = useRef<HTMLElement>(null);
  const { textSize, reduceMotion } = useAccessibilityStore();

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (textSize === 100) delete root.dataset.textSize;
    else root.dataset.textSize = String(textSize);
    root.toggleAttribute('data-reduce-motion', reduceMotion);
  }, [textSize, reduceMotion]);

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <MotionConfig reducedMotion={reduceMotion ? 'always' : 'user'}>
      <div className="flex min-h-screen flex-col">
        <a className="skip-link" href="#contenido-principal">Saltar al contenido</a>
        <Navbar />
        <main ref={main} id="contenido-principal" tabIndex={-1} className="min-w-0 flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
