import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Accessibility, X } from 'lucide-react';
import { TEXT_SIZES, useAccessibilityStore } from '@/store/accessibilityStore';

export function AccessibilityDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const { textSize, reduceMotion, setTextSize, setReduceMotion } = useAccessibilityStore();
  const sizeIndex = TEXT_SIZES.indexOf(textSize);

  const changeSize = (offset: number) => {
    const size = TEXT_SIZES[sizeIndex + offset];
    if (size !== undefined) setTextSize(size);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-ghost accessibility-trigger max-sm:w-[48px] max-sm:px-0"
        aria-label="Accesibilidad"
        aria-haspopup="dialog"
        aria-controls="ajustes-accesibilidad"
        onClick={() => dialog.current?.showModal()}
      >
        <Accessibility className="size-5 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">Accesibilidad</span>
      </button>

      <dialog ref={dialog} id="ajustes-accesibilidad" className="accessibility-dialog" aria-labelledby="titulo-accesibilidad">
        <form method="dialog" className="mb-4 flex items-start justify-between gap-3">
          <h2 id="titulo-accesibilidad" className="font-heading text-xl font-bold">Accesibilidad</h2>
          <button type="submit" className="btn btn-ghost nav-icon-button" aria-label="Cerrar accesibilidad">
            <X aria-hidden="true" className="size-5" />
          </button>
        </form>

        <fieldset className="min-w-0">
          <legend className="font-semibold">Tamaño del texto</legend>
          <p role="status" className="my-2">Tamaño actual <strong>{textSize} %</strong></p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-outline" aria-label="A− Reducir tamaño del texto"
              aria-disabled={sizeIndex === 0} onClick={() => changeSize(-1)}>
              A−
            </button>
            <button type="button" className="btn btn-outline" aria-label="A+ Aumentar tamaño del texto"
              aria-disabled={sizeIndex === TEXT_SIZES.length - 1} onClick={() => changeSize(1)}>
              A+
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setTextSize(100)}>
              Restablecer tamaño
            </button>
          </div>
        </fieldset>

        <div className="mt-5">
          <label htmlFor="reducir-movimiento" className="flex min-h-11 cursor-pointer items-center gap-3 font-medium">
            <input id="reducir-movimiento" type="checkbox" className="checkbox checkbox-primary shrink-0"
              checked={reduceMotion} aria-describedby="ayuda-movimiento"
              onChange={(event) => setReduceMotion(event.target.checked)} />
            Reducir movimiento
          </label>
          <p id="ayuda-movimiento" className="text-muted text-sm">
            El portal también respeta la preferencia de movimiento de tu dispositivo.
          </p>
        </div>

        <Link to="/accesibilidad" className="link link-primary mt-4 inline-flex min-h-11 items-center"
          onClick={() => dialog.current?.close()}>
          Información de accesibilidad y contacto
        </Link>
      </dialog>
    </>
  );
}
