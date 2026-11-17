import { useCallback, useEffect, useRef, useState } from 'react';

interface LookWordBackdropProps {
  word: string;
  color: string;
  isDetailOpen: boolean;
  isMobile: boolean;
  desktopShiftX: number;
  reducedMotion: boolean;
}

export function LookWordBackdrop({
  word,
  color,
  isDetailOpen,
  isMobile,
  desktopShiftX,
  reducedMotion,
}: LookWordBackdropProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [fontSize, setFontSize] = useState<number>(180);

  const [displayState, setDisplayState] = useState<{
    current: string;
    previous: string | null;
    transitionKey: number;
  }>({
    current: word,
    previous: null,
    transitionKey: 0,
  });

  useEffect(() => {
    setDisplayState((prev) => {
      if (prev.current === word) return prev;
      return {
        current: word,
        previous: reducedMotion ? null : prev.current,
        transitionKey: prev.transitionKey + 1,
      };
    });
  }, [word, reducedMotion]);

  useEffect(() => {
    if (!displayState.previous) return;
    const timer = window.setTimeout(() => {
      setDisplayState((prev) => ({ ...prev, previous: null }));
    }, 780);
    return () => window.clearTimeout(timer);
  }, [displayState.previous, displayState.transitionKey]);

  const computeFitFontSize = useCallback(
    (targetWord: string, targetWidth: number, maxHeight: number): number => {
      if (typeof document === 'undefined' || targetWidth <= 0) {
        return 120;
      }
      if (!measureCtxRef.current) {
        const canvas = document.createElement('canvas');
        measureCtxRef.current = canvas.getContext('2d');
      }
      const ctx = measureCtxRef.current;
      if (!ctx) {
        return Math.min(maxHeight * 0.85, targetWidth / Math.max(targetWord.length * 0.56, 1));
      }
      const testSize = 200;
      ctx.font = `400 ${testSize}px "Instrument Serif", "Cormorant Garamond", Georgia, serif`;
      const metrics = ctx.measureText(targetWord);
      const measuredWidth = Math.max(metrics.width, 1);
      const adjustedWidth = measuredWidth * 0.975;
      const byWidth = (targetWidth / adjustedWidth) * testSize;
      return Math.max(44, Math.min(byWidth, maxHeight * 0.9));
    },
    []
  );

  useEffect(() => {
    const updateSize = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const horizontalMargin = isMobile ? 12 : 40;
      const targetWidth = Math.max(200, rect.width - horizontalMargin);
      const maxHeight = rect.height * 0.88;
      setFontSize(computeFitFontSize(displayState.current, targetWidth, maxHeight));
    };

    updateSize();

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(updateSize).catch(() => {});
    }

    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [displayState.current, isMobile, computeFitFontSize]);

  const shiftTransform = isDetailOpen
    ? isMobile
      ? 'translate3d(0, -18%, 0) scale(0.84)'
      : `translate3d(${desktopShiftX}px, 0, 0) scale(0.76)`
    : 'translate3d(0, 0, 0) scale(1)';

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
      style={{
        zIndex: 2,
        opacity: isDetailOpen ? (isMobile ? 0.22 : 0.34) : 1,
        transform: shiftTransform,
        transition: reducedMotion
          ? 'none'
          : 'transform 760ms cubic-bezier(0.22, 1, 0.36, 1), opacity 580ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div
        className="relative flex w-full items-center justify-center overflow-hidden"
        style={{
          height: `${fontSize * 1.06}px`,
        }}
      >
        {displayState.previous && (
          <span
            key={`out-${displayState.transitionKey}`}
            className="sable-word-out absolute inset-x-0 text-center font-serif uppercase whitespace-nowrap leading-none"
            style={{
              fontSize: `${fontSize}px`,
              letterSpacing: '-0.02em',
              color,
              transition: reducedMotion ? 'none' : 'color 900ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {displayState.previous}
          </span>
        )}
        <span
          key={`in-${displayState.transitionKey}`}
          className={`${displayState.previous && !reducedMotion ? 'sable-word-in' : ''} block text-center font-serif uppercase whitespace-nowrap leading-none`}
          style={{
            fontSize: `${fontSize}px`,
            letterSpacing: '-0.02em',
            color,
            transition: reducedMotion ? 'none' : 'color 900ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {displayState.current}
        </span>
      </div>
    </div>
  );
}
