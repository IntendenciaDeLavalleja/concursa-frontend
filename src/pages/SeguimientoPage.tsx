import { useState } from 'react';
import type { FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Search, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { useSearchParams } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';

interface TrackingData {
  id: number;
  tracking_code: string;
  concurso_slug: string;
  concurso_titulo: string;
  fecha: string;
  documento: string;
  estado: string;
  estado_raw: 'recibida' | 'en_revision' | 'admitida' | 'rechazada';
}

const normalizeTrackingCode = (value: string) => value.trim().toUpperCase().replace(/\s+/g, '');

export function SeguimientoPage() {
  usePageTitle('Seguimiento de trámite');
  const [searchParams] = useSearchParams();
  const initCode = normalizeTrackingCode(searchParams.get('codigo') ?? '');

  const [codigo, setCodigo] = useState(initCode);
  const [searchCode, setSearchCode] = useState(initCode);
  const { data: trackingData, isFetching: isLoading, error, refetch } = useQuery({
    queryKey: ['postulacion-seguimiento', searchCode],
    queryFn: async ({ signal }) => {
      const { data } = await api.get<TrackingData>(
        `/concursos/postulaciones/seguimiento/${encodeURIComponent(searchCode)}`,
        { signal },
      );
      return data;
    },
    enabled: Boolean(searchCode),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    gcTime: 0,
  });

  let errorMsg: string | null = null;
  if (error) {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    if (status === 404) {
      errorMsg = 'El código de seguimiento ingresado no existe o es incorrecto.';
    } else if (status === 429) {
      errorMsg = 'Demasiados intentos. Por favor espera un momento.';
    } else {
      errorMsg = 'Ocurrió un error al buscar, intenta de nuevo más tarde.';
    }
  }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const normalizedCode = normalizeTrackingCode(codigo);
    if (!normalizedCode || isLoading) return;

    setCodigo(normalizedCode);
    if (normalizedCode === searchCode) {
      void refetch();
    } else {
      setSearchCode(normalizedCode);
    }
  };

  const getStatusConfig = (estado: TrackingData['estado_raw']) => {
    switch (estado) {
      case 'admitida':
        return { color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', icon: CheckCircle };
      case 'en_revision':
        return { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', icon: Clock };
      case 'rechazada':
        return { color: 'text-error', bg: 'bg-error/10', border: 'border-error/20', icon: XCircle };
      case 'recibida':
      default:
        return { color: 'text-info', bg: 'bg-info/10', border: 'border-info/20', icon: AlertCircle };
    }
  };
  const codigoIncorrecto = !isLoading && isAxiosError(error) && error.response?.status === 404
    && searchCode === normalizeTrackingCode(codigo);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Seguimiento de Trámite' }
        ]}
      />

      <div className="mx-auto mt-8 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="page-title">
            Seguimiento de Trámite
          </h1>
          <p className="mx-auto mt-4 max-w-prose text-lg text-muted">
            Ingresá el código de seguimiento que te enviamos por correo electrónico al momento de postularte.
          </p>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body form-panel-body">
            <form onSubmit={handleSearch} method="post" className="grid gap-2">
              <label htmlFor="codigo-tramite" className="font-semibold">Código de seguimiento</label>
              <p id="codigo-tramite-ayuda" className="text-sm text-muted">Por ejemplo, PT-2026-X8Z9L.</p>
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                <input
                  id="codigo-tramite"
                  name="codigo"
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="input input-bordered w-full font-mono uppercase"
                  readOnly={isLoading}
                  required
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={codigoIncorrecto}
                  aria-describedby={`codigo-tramite-ayuda${codigoIncorrecto ? ' codigo-tramite-error' : ''}`}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm" aria-hidden="true" />
                  ) : (
                    <Search className="w-5 h-5" aria-hidden="true" />
                  )}
                  {isLoading ? 'Consultando…' : 'Consultar'}
                </button>
              </div>
            </form>

            <p role="status" className="sr-only">
              {trackingData && !isLoading && !error && `Estado de la postulación ${trackingData.estado}.`}
            </p>
            {errorMsg && !isLoading && (
              <div id="codigo-tramite-error" className="alert alert-error mt-4" role="alert">
                <AlertCircle className="w-5 h-5" aria-hidden="true" />
                <span>{errorMsg}</span>
              </div>
            )}

            {trackingData && !isLoading && !error && (
              <section className="mt-8 space-y-6">
                <h2 className="font-heading text-xl font-bold">Resultado de la consulta</h2>

                <div className={`p-3 sm:p-6 rounded-2xl border flex flex-col sm:flex-row items-center gap-6 ${getStatusConfig(trackingData.estado_raw).bg} ${getStatusConfig(trackingData.estado_raw).border}`}>
                  <div className={`${getStatusConfig(trackingData.estado_raw).color}`}>
                    {(() => {
                      const Icon = getStatusConfig(trackingData.estado_raw).icon;
                      return <Icon className="w-16 h-16" aria-hidden="true" />;
                    })()}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm font-semibold uppercase tracking-wider text-muted">Estado de postulación</p>
                    <p className={`text-2xl font-bold mt-1 ${getStatusConfig(trackingData.estado_raw).color}`}>
                      {trackingData.estado}
                    </p>
                  </div>
                </div>

                <div className="bg-base-200/50 rounded-2xl p-3 sm:p-6 border border-base-200">
                  <h3 className="font-semibold text-lg mb-4">Detalles del trámite</h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-muted">Código de seguimiento</dt>
                      <dd className="font-mono mt-1">{trackingData.tracking_code}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted">Concurso</dt>
                      <dd className="font-medium mt-1">{trackingData.concurso_titulo}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted">Documento Identidad</dt>
                      <dd className="font-mono mt-1">{trackingData.documento}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted">Fecha de Presentación</dt>
                      <dd className="font-medium mt-1">{trackingData.fecha}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted">N° Registro interno</dt>
                      <dd className="font-mono mt-1">#{trackingData.id}</dd>
                    </div>
                  </dl>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
