import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle2, MailCheck } from 'lucide-react';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { verificarPostulacionEmail } from '@/services/postulaciones';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function PostulacionVerifyPage() {
  const { hash } = useLocation();
  const [searchParams] = useSearchParams();
  const fragment = new URLSearchParams(hash.slice(1));
  const uid = (fragment.get('uid') ?? searchParams.get('uid') ?? '').trim();
  const token = (fragment.get('token') ?? searchParams.get('token') ?? '').trim();
  const validLink = Boolean(uid && token);
  const heading = useRef<HTMLHeadingElement>(null);

  const { data, error, isPending, mutate } = useMutation({
    mutationFn: () => verificarPostulacionEmail(uid, token),
  });
  const problem = isAxiosError<{ message?: string; concurso_slug?: string }>(error) ? error.response?.data : undefined;
  const title = data
    ? data.already_verified ? 'Inscripción ya confirmada' : 'Inscripción confirmada'
    : 'Confirmar inscripción';
  usePageTitle(title);

  useEffect(() => {
    if (data) heading.current?.focus();
  }, [data]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <Breadcrumbs items={[{ label: 'Concursos', to: '/concursos' }, { label: 'Confirmar inscripción' }]} />

      <div className="card mt-5 border border-base-300 bg-base-100">
        <div className="card-body items-center px-5 py-8 text-center sm:p-10">
          <div className={`rounded-full p-4 ${data ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
            {data ? <CheckCircle2 className="size-10" aria-hidden="true" /> : <MailCheck className="size-10" aria-hidden="true" />}
          </div>
          <h1 ref={heading} tabIndex={-1} className="page-title mt-3">{title}</h1>

          {data ? (
            <>
              <p className="max-w-prose text-muted">Tu inscripción al concurso <strong>{data.concurso_titulo}</strong> está confirmada.</p>
              <div className="my-4 w-full max-w-sm rounded-2xl border border-base-300 bg-base-200 p-5">
                <p className="text-sm font-semibold text-muted">Código de seguimiento</p>
                <p className="mt-2 font-mono text-xl font-bold tracking-wide text-primary">{data.tracking_code}</p>
              </div>
              <p className="text-sm text-muted">
                {data.completion_email_sent ? 'También te enviamos el código por correo.' : 'Guardá el código para consultar el estado de tu postulación.'}
              </p>
              <Link className="btn btn-primary mt-3" to={`/seguimiento?codigo=${encodeURIComponent(data.tracking_code)}`}>Consultar seguimiento</Link>
            </>
          ) : (
            <>
              {validLink && <p className="max-w-prose text-muted">Confirmá que este correo te pertenece para finalizar la inscripción y obtener tu código de seguimiento.</p>}
              {(!validLink || error) && (
                <p className="alert alert-error mt-3 max-w-xl text-left" role="alert">
                  {validLink ? problem?.message || 'No pudimos confirmar la inscripción. Volvé a intentar.' : 'El enlace está incompleto. Abrilo desde el correo de preinscripción.'}
                </p>
              )}
              {problem?.concurso_slug ? (
                <Link className="btn btn-primary mt-3" to={`/concursos/${problem.concurso_slug}/postulacion#reenviar-confirmacion`}>
                  Reenviar confirmación de correo
                </Link>
              ) : validLink && (
                <button type="button" className="btn btn-primary mt-3" onClick={() => mutate()} disabled={isPending}>
                  {isPending ? 'Confirmando…' : 'Confirmar inscripción'}
                </button>
              )}
            </>
          )}

          <Link to="/concursos" className="btn btn-ghost mt-2">Volver a concursos</Link>
        </div>
      </div>
    </div>
  );
}
