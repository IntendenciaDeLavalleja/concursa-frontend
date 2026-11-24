import { CheckCircle2, ArrowRight, MailCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { reenviarConfirmacion, type ConfirmacionIdentidad } from '@/services/postulaciones';

export function PostulacionSuccess({ identidad, emailEnviado }: { identidad: ConfirmacionIdentidad; emailEnviado: boolean }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const { data, error, isPending, mutate } = useMutation({ mutationFn: reenviarConfirmacion });
  const errorMessage = isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;
  usePageTitle('Preinscripción registrada');

  useEffect(() => {
    heading.current?.focus();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center sm:py-16">
      <div className="rounded-full bg-success/10 p-6 mb-6">
        <CheckCircle2 className="h-16 w-16 text-success" aria-hidden="true" />
      </div>

      <h2 ref={heading} tabIndex={-1} className="font-heading text-2xl font-bold sm:text-3xl">
        ¡Preinscripción registrada!
      </h2>

      <p className="mt-3 max-w-md text-muted leading-relaxed">
        Ya guardamos tus datos. El siguiente paso es confirmar tu correo electrónico para finalizar la inscripción.
      </p>

      <div className="bg-base-200/50 rounded-xl p-4 my-6 border border-base-300 w-full max-w-xs">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">Revisá tu casilla</p>
        <p className="bg-base-100 py-3 px-4 rounded-lg border border-base-300 text-sm text-muted break-all">
          {identidad.email}
        </p>
      </div>

      <div className={`alert max-w-xl text-left ${emailEnviado || data ? 'alert-info' : 'alert-warning'}`}>
        <MailCheck className="h-5 w-5" aria-hidden="true" />
        <span>
          {emailEnviado || data
            ? 'Abrí el enlace del último correo y confirmá la inscripción para obtener tu código de seguimiento.'
            : 'Tus datos quedaron guardados. El correo de confirmación no pudo enviarse en este momento. Podés solicitar otro enlace.'}
        </span>
      </div>
      <button type="button" className="btn btn-outline mt-5" onClick={() => mutate(identidad)} disabled={isPending}>
        {isPending ? 'Solicitando enlace…' : 'Reenviar confirmación de correo'}
      </button>
      {data && <p className="mt-3 text-sm text-muted" role="status">{data.message}</p>}
      {error && <p className="alert alert-error mt-3" role="alert">{errorMessage || 'No pudimos solicitar el enlace. Intentá nuevamente.'}</p>}

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <Link to="/concursos" className="btn btn-ghost gap-2 w-full sm:w-auto">
          Ver concursos
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link to="/seguimiento" className="btn btn-primary gap-2 w-full sm:w-auto">
          Consultar seguimiento luego
        </Link>
      </div>
    </div>
  );
}
