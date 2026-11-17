import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { EditorialSection, Lang, UI_COPY } from '../config';

interface EditorialModalProps {
  lang: Lang;
  section: EditorialSection | null;
  reducedMotion: boolean;
  onClose: () => void;
}

export function EditorialModal({
  lang,
  section,
  reducedMotion,
  onClose,
}: EditorialModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (section) {
      const timer = window.setTimeout(() => {
        dialogRef.current?.focus({ preventScroll: true });
      }, 30);
      return () => window.clearTimeout(timer);
    }
  }, [section]);

  if (!section) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-5 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="editorial-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-black/10 bg-[#FAF8F5] p-7 shadow-xl outline-none md:p-9"
        style={{
          transition: reducedMotion ? 'none' : 'opacity 250ms ease',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="editorial-modal-title"
            className="font-serif text-3xl text-[#181615] md:text-4xl"
          >
            {section.heading[lang]}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={UI_COPY[lang].closeDialog}
            className="sable-hover-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/15 text-[#181615] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181615]"
          >
            <X className="h-4 w-4" strokeWidth={1.6} />
          </button>
        </div>

        <p className="mt-2 text-[14px] font-medium text-[#181615]/80">
          {section.subtitle[lang]}
        </p>

        <p className="mt-4 text-[14px] leading-relaxed text-[#181615]/70">
          {section.body[lang]}
        </p>

        <dl className="mt-6 divide-y divide-black/8 border-t border-black/10">
          {section.details.map((item, idx) => (
            <div
              key={idx}
              className="flex items-baseline justify-between gap-4 py-3 text-[13px]"
            >
              <dt className="text-[#181615]/55">{item.label[lang]}</dt>
              <dd className="text-right font-medium text-[#181615]">
                {item.value[lang]}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
