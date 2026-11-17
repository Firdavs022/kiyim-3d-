import { useEffect, useRef } from 'react';
import { X, Trash2 } from 'lucide-react';
import {
  BRAND_CONFIG,
  Lang,
  SIZE_OPTIONS,
  UI_COPY,
  formatPrice,
} from '../config';

export interface BagEntry {
  entryId: string;
  lookId: string;
  lookNumber: number;
  image: string;
  items: {
    pieceId: string;
    price: number;
    sizeKey: string;
  }[];
  total: number;
}

interface BagDrawerProps {
  lang: Lang;
  isOpen: boolean;
  entries: BagEntry[];
  reducedMotion: boolean;
  onRemoveEntry: (entryId: string) => void;
  onClose: () => void;
}

export function BagDrawer({
  lang,
  isOpen,
  entries,
  reducedMotion,
  onRemoveEntry,
  onClose,
}: BagDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const copy = UI_COPY[lang];

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        drawerRef.current?.focus({ preventScroll: true });
      }, 40);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const subtotal = entries.reduce((sum, entry) => sum + entry.total, 0);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[1px]"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: reducedMotion ? 'none' : 'opacity 320ms ease',
        }}
      />

      <aside
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={copy.selectionBag}
        inert={!isOpen ? true : undefined}
        className="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-[410px] flex-col border-l border-black/10 bg-[#FAF8F5] shadow-2xl outline-none"
        style={{
          transform: isOpen ? 'translate3d(0, 0, 0)' : 'translate3d(100%, 0, 0)',
          transition: reducedMotion
            ? 'none'
            : 'transform 460ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <h2 className="font-serif text-2xl text-[#181615]">
            {copy.selectionBag} ({entries.length})
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.closeBag}
            className="sable-hover-btn flex h-10 w-10 items-center justify-center rounded-full border border-black/15 text-[#181615] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181615]"
          >
            <X className="h-4 w-4" strokeWidth={1.6} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {entries.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-serif text-2xl text-[#181615]/80">
                {copy.bagEmptyTitle}
              </p>
              <p className="mt-2 max-w-[260px] text-[13px] leading-relaxed text-[#181615]/60">
                {copy.bagEmptyBody}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-black/10">
              {entries.map((entry) => {
                const look = BRAND_CONFIG.looks.find((l) => l.id === entry.lookId);
                const lookTitle = look ? look.title[lang] : '';
                return (
                  <li key={entry.entryId} className="flex gap-4 py-4 first:pt-0">
                    <div className="flex h-24 w-16 shrink-0 items-end justify-center overflow-hidden rounded-md bg-black/[0.04] p-1">
                      <img
                        src={entry.image}
                        alt={lookTitle}
                        referrerPolicy="no-referrer"
                        className="h-full w-auto object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.14em] text-[#181615]/55 tabular-nums">
                            {copy.lookWord} {String(entry.lookNumber).padStart(2, '0')}
                          </p>
                          <p className="font-serif text-xl leading-tight text-[#181615]">
                            {lookTitle}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveEntry(entry.entryId)}
                          aria-label={`${copy.removeFromBag}: ${lookTitle}`}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#181615]/45 transition-colors hover:text-[#181615] focus-visible:outline-2 focus-visible:outline-[#181615]"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} />
                        </button>
                      </div>

                      <ul className="mt-2 space-y-1">
                        {entry.items.map((item) => {
                          const piece = look?.pieces.find((p) => p.id === item.pieceId);
                          const sizeLabel =
                            piece &&
                            SIZE_OPTIONS[piece.category].find(
                              (s) => s.en === item.sizeKey
                            )?.[lang];
                          return (
                            <li
                              key={item.pieceId}
                              className="flex items-baseline justify-between gap-2 text-[12px] text-[#181615]/75"
                            >
                              <span className="truncate">
                                {piece?.name[lang]} · {sizeLabel || item.sizeKey}
                              </span>
                              <span className="shrink-0 tabular-nums">
                                {formatPrice(item.price, lang)}
                              </span>
                            </li>
                          );
                        })}
                      </ul>

                      <div className="mt-2.5 flex justify-end border-t border-black/6 pt-2 text-[13px] font-medium text-[#181615] tabular-nums">
                        {formatPrice(entry.total, lang)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {entries.length > 0 && (
          <div className="border-t border-black/10 px-6 py-5">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-[12px] uppercase tracking-[0.14em] text-[#181615]/60">
                {copy.subtotal}
              </span>
              <span className="font-serif text-2xl text-[#181615] tabular-nums">
                {formatPrice(subtotal, lang)}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="sable-hover-cta flex h-11 w-full items-center justify-center rounded-full bg-[#181615] px-6 text-[13px] font-medium text-[#FAF8F5] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181615]"
            >
              {copy.continueBrowsing}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
