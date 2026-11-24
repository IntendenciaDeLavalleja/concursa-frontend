import { useEffect, useRef, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Mail } from 'lucide-react';
import { FormField } from '@/components/ui/FormField';
import { reenviarConfirmacion } from '@/services/postulaciones';

export function ReenviarConfirmacion({ concursoId, mostrar, puedeInscribirse }: {
  concursoId: number;
  mostrar: boolean;
  puedeInscribirse: boolean;
}) {
  const details = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const { data, error, isPending, mutate } = useMutation({ mutationFn: reenviarConfirmacion });

  useEffect(() => {
    if (!mostrar || !details.current) return;
    details.current.open = true;
    summary.current?.focus();
  }, [mostrar]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    mutate({ concursoId, email: String(fields.get('email')), documento: String(fields.get('documento')) });
  }

  const message = isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;

  return (
    <details ref={details} id="reenviar-confirmacion" className="card mt-6 border border-base-300 bg-base-100 px-5">
      <summary ref={summary} className="cursor-pointer rounded-lg py-4 font-semibold text-primary">
        Reenviar confirmación de correo
      </summary>
      <div className="border-t border-base-300 py-5">
        <p className="mb-4 text-muted">
          Ingresá la cédula y el correo que usaste al preinscribirte{puedeInscribirse ? ' a este llamado' : ''}.
        </p>
        <form onSubmit={submit} method="post">
          <div className="form-fields">
            <FormField label="Correo de la preinscripción">
              <input className="input w-full" name="email" type="email" autoComplete="email" maxLength={120} />
            </FormField>
            <FormField label="Cédula de la preinscripción" helperText="Ingresá los 8 dígitos, sin puntos ni guiones.">
              <input className="input w-full" name="documento" inputMode="numeric" pattern="[0-9]{8}" maxLength={8} />
            </FormField>
          </div>
          <button type="submit" className="btn btn-primary mt-4 gap-2" disabled={isPending}>
            <Mail className="size-4" aria-hidden="true" />
            {isPending ? 'Solicitando enlace…' : 'Solicitar otro enlace'}
          </button>
          {data && <p className="mt-4 text-sm text-muted" role="status">{data.message}</p>}
          {error && <p className="alert alert-error mt-4" role="alert">{message || 'No pudimos solicitar el enlace. Intentá nuevamente.'}</p>}
        </form>
      </div>
    </details>
  );
}
