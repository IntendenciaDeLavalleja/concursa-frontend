import { cloneElement, useId } from 'react';
import type { ElementType, InputHTMLAttributes, ReactElement } from 'react';

type FieldAttributes = Pick<InputHTMLAttributes<HTMLInputElement>, 'id' | 'required' | 'aria-describedby' | 'aria-invalid'>;

interface Props {
  label: string;
  icon?: ElementType;
  error?: string;
  children: ReactElement<FieldAttributes>;
  className?: string;
  helperText?: string;
  required?: boolean;
}

export function FormField({ label, icon: Icon, error, children, className, helperText, required = true }: Props) {
  const id = useId();
  const descriptions = [helperText && `${id}-ayuda`, error && `${id}-error`].filter(Boolean).join(' ');

  return (
    <div className={`grid min-w-0 content-start gap-2 ${className ?? ''}`}>
      <label htmlFor={id} className="flex items-start gap-2 text-base font-semibold">
        {Icon && <Icon className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden="true" />}
        <span>{label}{required && <span aria-hidden="true"> *</span>}</span>
      </label>
      {helperText && <p id={`${id}-ayuda`} className="text-sm text-muted">{helperText}</p>}
      {cloneElement(children, { id, required, 'aria-invalid': Boolean(error), 'aria-describedby': descriptions || undefined })}
      {error && <p id={`${id}-error`} className="text-sm text-error">{error}</p>}
    </div>
  );
}
