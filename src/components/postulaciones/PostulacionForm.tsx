import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePostulacion } from '@/hooks/usePostulacion';
import { useId, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Upload, User, Mail, Phone, MapPin, FileText, Send, AlertCircle, Loader2 } from 'lucide-react';
import { PostulacionSuccess } from './PostulacionSuccess';
import { MAX_FILE_SIZE } from '@/constants';
import { verificarPostulacionDuplicada } from '@/services/postulaciones';
import { FormField } from '@/components/ui/FormField';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';

const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const URUGUAY_DATE_FORMAT = new Intl.DateTimeFormat('sv-SE', {
  year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Montevideo',
});
const todayInUruguay = () => URUGUAY_DATE_FORMAT.format(new Date());
const MAX_TOTAL_SIZE = 99 * 1024 * 1024;

const digitsOnly = (value: string, maxLength: number) => value.replace(/\D+/g, '').slice(0, maxLength);
const normalizeEmail = (value: string) => value.trim().toLowerCase();

const STEPS = [
  { label: 'Datos personales', title: 'Datos personales', icon: User },
  { label: 'Archivos', title: 'Documentación', icon: Upload },
  { label: 'Revisar', title: 'Revisar información cargada', icon: FileText },
  { label: 'Confirmar', title: 'Confirmación antes del envío', icon: Send },
];

const FILE_SECTIONS = [
  { key: 'curriculum', label: 'Currículum Vitae', required: true, accept: '.pdf,.doc,.docx', multiple: false },
  { key: 'cedula', label: 'Cédula de identidad', required: true, accept: '.pdf,.jpg,.jpeg,.png', multiple: false },
  { key: 'certificados', label: 'Certificados de estudio', required: false, accept: '.pdf,.jpg,.jpeg,.png', multiple: true },
  { key: 'constancias', label: 'Constancias laborales', required: false, accept: '.pdf,.jpg,.jpeg,.png', multiple: true },
  { key: 'adicional', label: 'Documentación adicional', required: false, accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png', multiple: true },
];

const isValidDateInput = (value: string) => {
  if (!DATE_INPUT_PATTERN.test(value)) {
    return false;
  }

  const parsedDate = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;
};

const createSchema = (requiere18: boolean) => z.object({
  nombre_completo: z.string().trim().min(3, 'Ingresá tu nombre completo').max(200),
  documento: z.string().regex(/^\d{8}$/, 'La cédula debe tener 8 dígitos, sin puntos ni guiones.'),
  fecha_nacimiento: z.string().min(1, 'Ingresá tu fecha de nacimiento').refine((val) => isValidDateInput(val), {
    message: 'Ingresá una fecha válida.',
  }).refine((val) => {
    return val <= todayInUruguay();
  }, { message: 'La fecha de nacimiento no puede estar en el futuro.' }).refine((val) => {
    if (!requiere18 || !isValidDateInput(val)) return true;
    const today = todayInUruguay();
    const age = Number(today.slice(0, 4)) - Number(val.slice(0, 4)) - Number(today.slice(5) < val.slice(5));
    return age >= 18;
  }, { message: 'Tenés que tener al menos 18 años para postularte.' }),
  email: z.string().trim().toLowerCase().email('Ingresá un correo válido').max(120, 'Ingresá un correo de hasta 120 caracteres.'),
  telefono: z.string().regex(/^\d{8,9}$/, 'El teléfono debe tener solo números y un máximo de 9 dígitos.'),
  domicilio: z.string().trim().min(3, 'Ingresá tu domicilio').max(300),
  localidad: z.string().trim().min(2, 'Ingresá tu localidad').max(100),
  concurso_id: z.number({ error: 'Seleccioná un concurso' }).positive(),
  observaciones: z.string().max(1000).optional(),
});

type FormData = z.infer<ReturnType<typeof createSchema>>;

interface Props {
  concursoId: number;
  concursoTitulo: string;
  requiere18Anos?: boolean;
  puedeInscribirse: boolean;
  contenidoBloqueado: ReactNode;
}

interface SubmittedState {
  email: string;
  documento: string;
  emailEnviado: boolean;
}

export function PostulacionForm({
  concursoId, concursoTitulo, requiere18Anos = true, puedeInscribirse, contenidoBloqueado,
}: Props) {
  const [step, setStep] = useState(0);
  const previousStep = useRef(step);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const confirmation = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [files, setFiles] = useState<Record<string, File | File[]>>({});
  const [fileErrors, setFileErrors] = useState<Record<string, string | undefined>>({});
  const [confirmationAccepted, setConfirmationAccepted] = useState(false);
  const [confirmationError, setConfirmationError] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [canRecover, setCanRecover] = useState(false);
  const [submitted, setSubmitted] = useState<SubmittedState | null>(null);

  const mutation = usePostulacion();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(createSchema(requiere18Anos)),
    defaultValues: { concurso_id: concursoId },
  });

  useLayoutEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    stepHeading.current?.focus();
  }, [step]);

  const checkDuplicateField = async (field: 'email' | 'documento') => {
    const normalize = field === 'email' ? normalizeEmail : (value: string) => value.trim();
    const value = normalize(getValues(field) ?? '');
    if (!value) return;

    const isValid = await trigger(field);
    if (!isValid) {
      return;
    }


    try {
      const response = await verificarPostulacionDuplicada({
        concursoId,
        email: field === 'email' ? value : undefined,
        documento: field === 'documento' ? value : undefined,
      });
      if (normalize(getValues(field) ?? '') !== value) return;

      if (field === 'email') {
        if (response.duplicate_email) {
          setError('email', {
            type: 'duplicate',
            message: 'Este correo electrónico ya fue registrado en este llamado.',
          });
        } else if (errors.email?.type === 'duplicate') {
          clearErrors('email');
        }
      }

      if (field === 'documento') {
        if (response.duplicate_documento) {
          setError('documento', {
            type: 'duplicate',
            message: 'Esta cédula de identidad ya fue registrada en este llamado.',
          });
        } else if (errors.documento?.type === 'duplicate') {
          clearErrors('documento');
        }
      }
    } catch {
      // El submit vuelve a validar en backend; si esta comprobación previa falla, no bloqueamos la edición.
    }
  };

  const documentoField = register('documento', {
    onChange: (event) => {
      event.target.value = digitsOnly(event.target.value, 8);
    },
    onBlur: async () => {
      await checkDuplicateField('documento');
    },
  });

  const emailField = register('email', {
    onBlur: async (event) => {
      event.target.value = normalizeEmail(event.target.value);
      await checkDuplicateField('email');
    },
  });

  const telefonoField = register('telefono', {
    onChange: (event) => {
      event.target.value = digitsOnly(event.target.value, 9);
    },
  });

  const nextStep = async () => {
    if (step === 0) {
      const valid = await trigger([
        'nombre_completo', 'documento', 'fecha_nacimiento', 'email', 'telefono', 'domicilio', 'localidad', 'observaciones',
      ], { shouldFocus: true });
      if (!valid) return;
    }
    if (step === 1) {
      const validation = { ...fileErrors };
      for (const section of FILE_SECTIONS) {
        if (section.required && !files[section.key] && !validation[section.key]) {
          validation[section.key] = 'Seleccioná un archivo para continuar.';
        }
      }
      setFileErrors(validation);
      const firstError = FILE_SECTIONS.find(({ key }) => validation[key]);
      if (firstError) {
        form.current?.querySelector<HTMLInputElement>('input[name="' + firstError.key + '"]')?.focus();
        return;
      }
      if (Object.values(files).flat().reduce((total, file) => total + (file?.size ?? 0), 0) > MAX_TOTAL_SIZE) {
        setSubmitError('El total de los archivos supera 99 MB. Reducí el tamaño de los adjuntos.');
        return;
      }
      setSubmitError('');
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleFileChange = (section: (typeof FILE_SECTIONS)[number], fileList: FileList | null) => {
    const fileArray = Array.from(fileList ?? []);
    const invalid = fileArray.find((file) => {
      const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      return file.size === 0 || file.size > MAX_FILE_SIZE || !section.accept.split(',').includes(extension);
    });
    setFileErrors((previous) => ({
      ...previous,
      [section.key]: invalid ? 'Elegí un archivo en un formato admitido, de más de 0 bytes y hasta 10 MB.' : undefined,
    }));
    setSubmitError('');

    setFiles((prev) => ({
      ...prev,
      [section.key]: section.multiple && !invalid ? fileArray : invalid ? [] : fileArray[0],
    }));
    return !invalid;
  };

  const onSubmit = (data: FormData) => {
    if (!puedeInscribirse) return;
    setSubmitError('');
    setCanRecover(false);
    mutation.mutate(
      { data, archivos: files },
      {
        onSuccess: (res) => setSubmitted({ email: res.email, documento: data.documento, emailEnviado: res.verification_email_sent }),
        onError: (error: unknown) => {
          const response = isAxiosError<{ message?: string; errors?: string[] }>(error) ? error.response : undefined;
          const status = response?.status;
          setCanRecover(status === 409 || !status);
          const msg = status === 413 ? 'El envío supera el tamaño máximo. Reducí el tamaño de los archivos.'
            : status === 409 ? response?.data?.message
            : response?.data?.errors?.[0] || response?.data?.message;
          setSubmitError(msg || 'No pudimos enviar la postulación. Intentá nuevamente.');
        },
      }
    );
  };

  const submitStep = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!puedeInscribirse || mutation.isPending) return;
    if (step < STEPS.length - 1) {
      void nextStep();
      return;
    }
    if (!confirmationAccepted) {
      setConfirmationError(true);
      confirmation.current?.focus();
      return;
    }
    void handleSubmit(onSubmit, () => setStep(0))(event);
  };

  const getFileNames = (value?: File | File[]) => {
    if (!value) return [];
    return Array.isArray(value) ? value.map((file) => file.name) : [value.name];
  };

  if (!puedeInscribirse && !mutation.isPending && !submitted) return contenidoBloqueado;

  const { title, icon: StepIcon } = STEPS[step];
  const contenido = submitted ? (
    <PostulacionSuccess identidad={{ concursoId, email: submitted.email, documento: submitted.documento }} emailEnviado={submitted.emailEnviado} />
  ) : (
    <div className="space-y-6">
      <ol aria-label="Pasos de postulación" role="list"
        className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] gap-2">
        {STEPS.map(({ label }, index) => (
          <li key={label} aria-current={index === step ? 'step' : undefined}
            className={`min-w-0 rounded-xl border px-3 py-2.5 text-sm ${index === step ? 'border-primary bg-primary/10 font-bold text-primary' : 'border-base-300 text-muted'}`}>
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      <form ref={form} onSubmit={submitStep} method="post" noValidate>
        <h2 ref={stepHeading} tabIndex={-1} className="mb-5 flex items-start gap-2 font-heading text-2xl font-semibold">
          <StepIcon className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
          <span><span className="sr-only">Paso {step + 1} de {STEPS.length}. </span>{title}</span>
        </h2>
        {step === 0 && (
          <div>
            {concursoTitulo && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-info/30 bg-info/8 p-4">
                <FileText className="mt-1 size-5 shrink-0 text-info" aria-hidden="true" />
                <p>Postulación a <strong>{concursoTitulo}</strong></p>
              </div>
            )}

            <input type="hidden" {...register('concurso_id', { valueAsNumber: true })} />

            <p className="mb-4 text-sm text-muted">Los campos marcados con asterisco (*) son obligatorios.</p>
            <p role="status" className="sr-only">
              {Object.keys(errors).length > 0 && 'Revisá los datos personales marcados con error.'}
            </p>
            <div className="form-fields">
              <FormField label="Nombre completo" icon={User} error={errors.nombre_completo?.message}>
                <input {...register('nombre_completo')} autoComplete="name" maxLength={200} className="input w-full" />
              </FormField>

              <FormField
                label="Documento de identidad"
                icon={FileText}
                error={errors.documento?.message}
                helperText="Ingresá los 8 dígitos de la cédula, incluyendo el dígito final, sin puntos ni guiones."
              >
                <input
                  {...documentoField}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  className="input w-full"
                />
              </FormField>

              <FormField label="Fecha de nacimiento" error={errors.fecha_nacimiento?.message}>
                <input type="date" autoComplete="bday" max={todayInUruguay()} {...register('fecha_nacimiento')} className="input w-full" />
              </FormField>

              <FormField label="Correo electrónico" icon={Mail} error={errors.email?.message}>
                <input type="email" autoComplete="email" maxLength={120} {...emailField} className="input w-full" />
              </FormField>

              <FormField
                label="Teléfono"
                icon={Phone}
                error={errors.telefono?.message}
                helperText="Ingresá 8 o 9 dígitos, sin espacios."
              >
                <input
                  {...telefonoField}
                  type="tel"
                  autoComplete="tel-national"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={9}
                  className="input w-full"
                />
              </FormField>

              <FormField label="Domicilio" icon={MapPin} error={errors.domicilio?.message}>
                <input {...register('domicilio')} autoComplete="street-address" maxLength={300} className="input w-full" placeholder="Calle y número" />
              </FormField>

              <FormField label="Localidad" icon={MapPin} error={errors.localidad?.message} className="col-span-full">
                <input {...register('localidad')} autoComplete="address-level2" maxLength={100} className="input w-full" />
              </FormField>
            </div>

            <div className="mt-5">
              <FormField label="Observaciones (opcional)" required={false} error={errors.observaciones?.message}>
                <textarea {...register('observaciones')} maxLength={1000} className="textarea min-h-28 w-full" />
              </FormField>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            {FILE_SECTIONS.map((section) => (
              <FileUploadField
                key={section.key}
                name={section.key}
                label={section.label}
                accept={section.accept}
                multiple={section.multiple}
                required={section.required}
                files={files[section.key]}
                error={fileErrors[section.key]}
                onChange={(fileList) => handleFileChange(section, fileList)}
              />
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="alert alert-info mb-4">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm">Revisá todos tus datos y la documentación adjunta. En el siguiente paso vas a confirmar formalmente la postulación.</span>
            </div>

            <div className="card bg-base-200/50 border border-base-300/50 rounded-2xl">
              <div className="card-body p-3 sm:p-6 text-sm divide-y divide-base-300">
                <div className="pb-4">
                  <h3 className="font-bold text-base mb-3">Datos personales</h3>
                  <ul className="space-y-1">
                    <li><strong>Nombre:</strong> {getValues('nombre_completo')}</li>
                    <li><strong>Documento:</strong> {getValues('documento')}</li>
                    <li><strong>Fecha de nacimiento:</strong> {getValues('fecha_nacimiento')}</li>
                    <li><strong>Email:</strong> {getValues('email')}</li>
                    <li><strong>Teléfono:</strong> {getValues('telefono')}</li>
                    <li><strong>Domicilio:</strong> {getValues('domicilio')}, {getValues('localidad')}</li>
                    {getValues('observaciones') && (
                      <li><strong>Observaciones:</strong> {getValues('observaciones')}</li>
                    )}
                  </ul>
                </div>

                <div className="pt-4">
                  <h3 className="font-bold text-base mb-3">Archivos adjuntos</h3>
                  <div className="space-y-3">
                    {FILE_SECTIONS.map((section) => {
                      const fileNames = getFileNames(files[section.key]);
                      const hasFiles = fileNames.length > 0;

                      return (
                        <div key={section.key} className="rounded-xl border border-base-300/70 bg-base-100/70 p-2 sm:p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="font-medium text-base-content">{section.label}</p>
                            <span className={`badge ${hasFiles ? 'badge-success' : section.required ? 'badge-error' : 'badge-ghost'}`}>
                              {hasFiles ? `${fileNames.length} archivo(s)` : section.required ? 'Pendiente' : 'Opcional'}
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-muted space-y-1">
                            {hasFiles ? fileNames.map((name) => <p key={name}>{name}</p>) : <p>No se adjuntaron archivos en esta categoría.</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="alert alert-warning mb-4">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm">Este es el último control antes de registrar tu preinscripción. Una vez enviada, no vas a poder editar la información cargada.</span>
            </div>

            <div className="space-y-4 rounded-2xl border border-base-300 bg-base-100/60 p-3 sm:p-6">
              <div>
                <h3 className="font-bold text-base mb-2">Verificación requerida</h3>
                <p className="text-sm text-muted">
                  Confirmá que revisaste los datos personales, la documentación adjunta y que entendés que el siguiente paso registrará tu postulación para validación por correo electrónico.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <input
                  ref={confirmation}
                  id="confirmar-postulacion"
                  name="confirmar-postulacion"
                  type="checkbox"
                  required
                  checked={confirmationAccepted}
                  onChange={(event) => {
                    setConfirmationAccepted(event.target.checked);
                    if (event.target.checked) setConfirmationError(false);
                  }}
                  aria-invalid={confirmationError || undefined}
                  aria-describedby={confirmationError ? 'confirmar-postulacion-error' : undefined}
                  className="checkbox checkbox-primary mt-0.5 shrink-0"
                />
                <label htmlFor="confirmar-postulacion" className="min-h-11 cursor-pointer text-sm leading-relaxed">
                  Verifiqué que todos mis datos son correctos, que la documentación adjunta corresponde a esta postulación y que deseo continuar con el envío.
                </label>
              </div>
              {confirmationError && (
                <p id="confirmar-postulacion-error" role="alert" className="text-sm text-error">
                  Marcá la casilla de confirmación para enviar la postulación.
                </p>
              )}
            </div>
          </div>
        )}

        {submitError && (
          <div className="alert alert-error mt-4">
            <p role="alert">{submitError}</p>
            {canRecover && <Link to="#reenviar-confirmacion" className="underline">Reenviar confirmación de correo</Link>}
          </div>
        )}
        <div className="mt-8 flex flex-wrap justify-end gap-3">
          {step > 0 ? (
            <button type="button" disabled={mutation.isPending} onClick={prevStep} className="btn btn-ghost me-auto">
              Atrás
            </button>
          ) : null}

          <button type="submit" disabled={mutation.isPending} className="btn btn-primary gap-2 px-6">
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {step < STEPS.length - 1 ? 'Siguiente' : mutation.isPending ? 'Enviando…' : 'Enviar postulación'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <header className="concursos-heading mb-6 mt-5">
        <h1 className="page-title">Formulario de Postulación</h1>
        <p className="mt-3 max-w-prose text-lg text-muted">
          Completá tus datos y adjuntá la documentación requerida
        </p>
      </header>
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body form-panel-body">{contenido}</div>
      </div>
    </>
  );
}

function FileUploadField({ name, label, accept, multiple, required, files, error, onChange }: {
  name: string;
  label: string;
  accept: string;
  multiple?: boolean;
  required: boolean;
  files?: File | File[];
  error?: string;
  onChange: (files: FileList | null) => boolean;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const fileNames = files
    ? Array.isArray(files)
      ? files.map((f) => f.name).join(', ')
      : files.name
    : null;

  return (
    <div className="grid min-w-0 gap-2">
      <label htmlFor={id} className="text-base font-semibold">{label} {required ? '(obligatorio)' : '(opcional)'}</label>
      <p id={`${id}-ayuda`} className="text-sm text-muted">
        Formatos admitidos {accept.replaceAll('.', '').toUpperCase().split(',').join(', ')}. Hasta 10 MB por archivo.
      </p>
      <input
        ref={input}
        id={id}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        required={required && !fileNames}
        onChange={(event) => {
          if (!onChange(event.target.files)) event.target.value = '';
        }}
        className="file-input file-input-bordered w-full"
        aria-invalid={Boolean(error)}
        aria-describedby={`${id}-ayuda${error ? ` ${id}-error` : ''}${fileNames ? ` ${id}-archivos` : ''}`}
      />
      {error && <p id={`${id}-error`} className="text-sm text-error" role="alert">{error}</p>}
      {fileNames && (
        <div className="flex flex-wrap items-center gap-2">
          <p id={`${id}-archivos`} className="text-sm text-muted">Archivos seleccionados {fileNames}</p>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
            onChange(null);
            if (input.current) {
              input.current.value = '';
              input.current.focus();
            }
          }}>Quitar archivos<span className="sr-only"> de {label}</span></button>
        </div>
      )}
    </div>
  );
}
