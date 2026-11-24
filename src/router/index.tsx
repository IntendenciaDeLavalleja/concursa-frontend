import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import FAQPage from '@/pages/FAQPage';
import AccesibilidadPage from '@/pages/AccesibilidadPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { SkeletonPage } from '@/components/ui/Skeleton';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    hydrateFallbackElement: <SkeletonPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'concursos', lazy: async () => ({ Component: (await import('@/pages/ConcursosPage')).default }) },
      { path: 'concursos/:slug', lazy: async () => ({ Component: (await import('@/pages/ConcursoDetailPage')).default }) },
      { path: 'concursos/:slug/documentos/:documentoSlug', lazy: async () => ({ Component: (await import('@/pages/ConcursoDocumentPage')).default }) },
      { path: 'concursos/:slug/postulacion', lazy: async () => ({ Component: (await import('@/pages/PostulacionPage')).default }) },
      { path: 'postulacion/verificar', lazy: async () => ({ Component: (await import('@/pages/PostulacionVerifyPage')).default }) },
      { path: 'postulacion', element: <Navigate to="/concursos" replace /> },
      { path: 'seguimiento', lazy: async () => ({ Component: (await import('@/pages/SeguimientoPage')).SeguimientoPage }) },
      { path: 'faq', element: <FAQPage /> },
      { path: 'accesibilidad', element: <AccesibilidadPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
