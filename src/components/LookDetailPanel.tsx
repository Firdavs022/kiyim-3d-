import { useEffect, useRef, useState } from 'react';
import { X, Check } from 'lucide-react';
import {
  Lang,
  Look,
  SIZE_OPTIONS,
  UI_COPY,
  formatPrice,
  getLookTotal,
} from '../config';

interface LookDetailPanelProps {
  lang: Lang;
  look: Look;
  lookNumber: number;
  totalLooks: number;
  isOpen: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  selectedSizes: Record<string, string>;
  onSelectSize: (pieceId: string, sizeKey: string) => void;
  onAddLookToBag: (look: Look, sizes: Record<string, string>) => void;
  onClose: () => void;
}

export function LookDetailPanel({
  lang,
  look,
  lookNumber,
  totalLooks,
  isOpen,
  isMobile,
  reducedMotion,
  selectedSizes,
  onSelectSize,
  onAddLookToBag,
  onClose,
}: LookDetailPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [justAdded, setJustAdded] = useState(false);
  const copy = UI_COPY[lang];

  useEffect(() => {
    setJustAdded(false);
  }, [look.id, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        panelRef.current?.focus({ preventScroll: true });
      }, 40);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const total = getLookTotal(look);
  const formattedNumber = String(lookNumber).padStart(2, '0');
  const formattedTotal = String(totalLooks).padStart(2, '0');

  const handleAdd = () => {
    onAddLookToBag(look, selectedSizes);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  const handleRadioKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    pieceId: string,
    sizes: string[],
    currentIndex: number
  ) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = sizes[(currentIndex + 1) % sizes.length];
      onSelectSize(pieceId, next);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = sizes[(currentIndex - 1 + sizes.length) % sizes.length];
      onSelectSize(pieceId, prev);
    }
  };

  return (
    <aside
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-label={`${copy.lookWord} ${formattedNumber}: ${look.title[lang]}`}
      inert={!isOpen ? true : undefined}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className={
        isMobile
          ? 'fixed inset-x-0 bottom-0 z-40 flex h-[56dvh] flex-col rounded-t-2xl border-t border-black/10 bg-[#FAF8F5]/95 shadow-[0_-18px_48px_rgba(0,0,0,0.12)] backdrop-blur-md outline-none'
          : 'fixed top-14 right-0 bottom-0 z-40 flex w-[390px] lg:w-[440px] flex-col border-l border-black/10 bg-[#FAF8F5]/94 backdrop-blur-md outline-none'
      }
      style={{
        transform: isOpen
          ? 'translate3d(0, 0, 0)'
          : isMobile
            ? 'translate3d(0, 105%, 0)'
            : 'translate3d(105%, 0, 0)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: reducedMotion
          ? 'none'
          : 'transform 620ms cubic-bezier(0.22, 1, 0.36, 1), opacity 460ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-black/8 px-6 pt-5 pb-4 md:px-8 md:pt-7 md:pb-5">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#181615]/55 tabular-nums">
            {copy.lookWord} {formattedNumber} / {formattedTotal}
          </p>
          <h2 className="mt-1 font-serif text-3xl leading-[1.06] text-[#181615] md:text-[2.15rem]">
            {look.title[lang]}
          </h2>
        </div>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={copy.closeDetails}
          className="sable-hover-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/15 text-[#181615] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181615]"
        >
          <X className="h-4 w-4" strokeWidth={1.6} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-4 md:px-8 md:py-5">
        <p className="text-[13px] leading-relaxed text-[#181615]/75 md:text-[14px]">
          {look.note[lang]}
        </p>

        <div className="mt-5 divide-y divide-black/8 border-t border-black/8">
          {look.pieces.map((piece) => {
            const sizes = SIZE_OPTIONS[piece.category];
            const sizeKeys = sizes.map((s) => s.en);
            const activeSizeKey = selectedSizes[piece.id] || sizeKeys[0];

            return (
              <div key={piece.id} className="py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[14px] font-medium text-[#181615]">
                    {piece.name[lang]}
                  </h3>
                  <span className="shrink-0 text-[13px] font-medium text-[#181615] tabular-nums">
                    {formatPrice(piece.price, lang)}
                  </span>
                </div>

                <p className="mt-0.5 text-[12px] text-[#181615]/60">
                  {piece.fabric[lang]}
                </p>

                <div
                  role="radiogroup"
                  aria-label={`${copy.selectSizeFor} ${piece.name[lang]}`}
                  className="mt-3 flex flex-wrap items-center gap-1.5"
                >
                  {sizes.map((sizeObj, idx) => {
                    const sizeKey = sizeObj.en;
                    const checked = activeSizeKey === sizeKey;
                    return (
                      <button
                        key={sizeKey}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        tabIndex={checked ? 0 : -1}
                        onClick={() => onSelectSize(piece.id, sizeKey)}
                        onKeyDown={(e) =>
                          handleRadioKeyDown(e, piece.id, sizeKeys, idx)
                        }
                        className={`min-h-[34px] min-w-[38px] rounded-full border px-3 py-1 text-[12px] font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181615] ${
                          checked
                            ? 'border-[#181615] bg-[#181615] text-[#FAF8F5]'
                            : 'border-black/15 bg-transparent text-[#181615]/80 sable-hover-btn'
                        }`}
                      >
                        {sizeObj[lang]}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pinned footer */}
      <div className="border-t border-black/10 bg-[#FAF8F5]/95 px-6 py-4 md:px-8 md:py-5">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-[12px] uppercase tracking-[0.14em] text-[#181615]/60">
            {copy.completeLookTotal}
          </span>
          <span className="font-serif text-2xl text-[#181615] tabular-nums">
            {formatPrice(total, lang)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="sable-hover-cta flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#181615] px-6 text-[13px] font-medium tracking-[0.02em] text-[#FAF8F5] whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181615]"
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" strokeWidth={1.75} />
              <span>{copy.addedToBag}</span>
            </>
          ) : (
            <span>{copy.addToBag}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
