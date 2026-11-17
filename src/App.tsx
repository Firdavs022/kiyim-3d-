import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  BRAND_CONFIG,
  EditorialSection,
  Lang,
  Look,
  SIZE_OPTIONS,
  UI_COPY,
  formatPrice,
  getLookTotal,
} from './config';
import { LookWordBackdrop } from './components/LookWordBackdrop';
import { LookDetailPanel } from './components/LookDetailPanel';
import { BagDrawer, BagEntry } from './components/BagDrawer';
import { EditorialModal } from './components/EditorialModal';

const LOOKS = BRAND_CONFIG.looks;
const LOOK_COUNT = LOOKS.length;
const HALF_COUNT = LOOK_COUNT / 2;
const LANG_OPTIONS: { id: Lang; label: string }[] = [
  { id: 'uz', label: 'UZ' },
  { id: 'en', label: 'EN' },
  { id: 'ru', label: 'RU' },
];

function modIndex(n: number): number {
  return ((n % LOOK_COUNT) + LOOK_COUNT) % LOOK_COUNT;
}

function wrappedDistance(index: number, pos: number): number {
  let d =
    (((index - pos) % LOOK_COUNT) + LOOK_COUNT + HALF_COUNT) % LOOK_COUNT -
    HALF_COUNT;
  if (d >= HALF_COUNT) d -= LOOK_COUNT;
  if (d < -HALF_COUNT) d += LOOK_COUNT;
  return d;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function getDefaultSizes(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const look of LOOKS) {
    for (const piece of look.pieces) {
      const options = SIZE_OPTIONS[piece.category];
      if (piece.category === 'clothing') {
        map[piece.id] = options.some((o) => o.en === 'M') ? 'M' : options[0].en;
      } else if (piece.category === 'shoe') {
        map[piece.id] = options.some((o) => o.en === '38') ? '38' : options[0].en;
      } else {
        map[piece.id] = options[0].en;
      }
    }
  }
  return map;
}

/**
 * Infinitely smooth (C-infinity) rail mapping:
 * - scale: 1.0 at center, 0.70 at ±1, ~0.62 at ±2, zero derivative kinks
 * - opacity: smoothly fades to 0 by |d| = 2.90, well before ±4.0 wrap
 * - x: smooth non-linear compression keeping scaled neighbors balanced
 */
function getRailMetrics(d: number, baseStep: number) {
  const absD = Math.abs(d);

  const scale = 0.58 + 0.42 / (1 + 2.5 * absD * absD);

  let opacity = 0;
  if (absD <= 1) {
    opacity = 1 - 0.08 * smoothstep(0, 1, absD);
  } else if (absD < 2.9) {
    opacity = 0.92 * (1 - smoothstep(1.0, 2.9, absD));
  }

  const x = d * baseStep * (0.76 + 0.24 / (1 + 0.35 * absD * absD));
  const zIndex = Math.max(1, Math.round(30 - absD * 8));

  return { x, scale, opacity, zIndex };
}

export default function App() {
  const [lang, setLang] = useState<Lang>('uz');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [activeEditorial, setActiveEditorial] = useState<EditorialSection | null>(
    null
  );
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    getDefaultSizes
  );
  const [bagEntries, setBagEntries] = useState<BagEntry[]>([]);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [viewport, setViewport] = useState<{ width: number; height: number }>(
    () => ({
      width: typeof window !== 'undefined' ? window.innerWidth : 1440,
      height: typeof window !== 'undefined' ? window.innerHeight : 900,
    })
  );
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  const copy = UI_COPY[lang];
  const isMobile = viewport.width < 768;
  const desktopPanelWidth = viewport.width >= 1024 ? 440 : 390;
  const desktopShiftX = isMobile ? 0 : -desktopPanelWidth / 2;

  // Rail engine refs (never stored in React state)
  const targetRef = useRef(0);
  const posRef = useRef(0);
  const velRef = useRef(0);
  const panelProgressRef = useRef(0);
  const panelVelRef = useRef(0);
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const activeIndexRef = useRef(0);
  const isDetailOpenRef = useRef(false);
  const isModalOpenRef = useRef(false);
  const isMobileRef = useRef(isMobile);
  const reducedMotionRef = useRef(reducedMotion);
  const desktopShiftXRef = useRef(desktopShiftX);
  const lastInputTimeRef = useRef(Date.now());
  const stageWidthRef = useRef(viewport.width);
  const stageHeightRef = useRef(Math.max(320, viewport.height - 180));
  const viewportHeightRef = useRef(viewport.height);
  const footerHeightRef = useRef(132);

  const stageRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const figureRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lightPoolRef = useRef<HTMLDivElement>(null);

  // Pointer & wheel gesture refs
  const dragStateRef = useRef<{
    pointerId: number | null;
    startX: number;
    startY: number;
    startTarget: number;
    lastX: number;
    lastTime: number;
    velocity: number;
    lock: 'horizontal' | 'vertical' | null;
  }>({
    pointerId: null,
    startX: 0,
    startY: 0,
    startTarget: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    lock: null,
  });
  const wheelAccumRef = useRef(0);
  const wheelCooldownUntilRef = useRef(0);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    isDetailOpenRef.current = isDetailOpen;
  }, [isDetailOpen]);

  useEffect(() => {
    isModalOpenRef.current = isBagOpen || activeEditorial !== null;
  }, [isBagOpen, activeEditorial]);

  useEffect(() => {
    isMobileRef.current = isMobile;
    desktopShiftXRef.current = desktopShiftX;
  }, [isMobile, desktopShiftX]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  // Listen for viewport resize & prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onMotionChange);

    const onResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      viewportHeightRef.current = window.innerHeight;
      if (stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        stageWidthRef.current = rect.width;
        stageHeightRef.current = rect.height;
      }
      if (footerRef.current) {
        footerHeightRef.current = footerRef.current.getBoundingClientRect().height;
      }
    };
    onResize();
    window.addEventListener('resize', onResize);

    return () => {
      mq.removeEventListener('change', onMotionChange);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const recordUserInput = useCallback(() => {
    lastInputTimeRef.current = Date.now();
  }, []);

  const syncActiveIndex = useCallback((nextTarget: number) => {
    const snapped = modIndex(Math.round(nextTarget));
    if (snapped !== activeIndexRef.current) {
      activeIndexRef.current = snapped;
      setActiveIndex(snapped);
    }
  }, []);

  const stepBy = useCallback(
    (delta: number) => {
      recordUserInput();
      targetRef.current = Math.round(targetRef.current) + delta;
      syncActiveIndex(targetRef.current);
    },
    [recordUserInput, syncActiveIndex]
  );

  const goToLook = useCallback(
    (index: number) => {
      recordUserInput();
      const currentSnapped = Math.round(targetRef.current);
      const d = wrappedDistance(index, modIndex(currentSnapped));
      targetRef.current = currentSnapped + d;
      syncActiveIndex(targetRef.current);
    },
    [recordUserInput, syncActiveIndex]
  );

  // Single requestAnimationFrame loop using frame-rate independent critically-damped springs
  useEffect(() => {
    let rafId = 0;
    let prevTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.035, Math.max(0.001, (now - prevTime) / 1000));
      prevTime = now;

      const reduced = reducedMotionRef.current;
      const target = targetRef.current;
      const dragging = isDraggingRef.current;

      if (reduced) {
        posRef.current = target;
        velRef.current = 0;
      } else {
        // Critically damped spring: natural ease-in + ease-out with zero overshoot
        const omega = dragging ? 28 : 7.6;
        const diff = posRef.current - target;
        if (Math.abs(diff) < 0.00025 && Math.abs(velRef.current) < 0.0005) {
          posRef.current = target;
          velRef.current = 0;
        } else {
          const exp = Math.exp(-omega * dt);
          const temp = (velRef.current + omega * diff) * dt;
          velRef.current = (velRef.current - omega * temp) * exp;
          posRef.current = target + (diff + temp) * exp;
        }
      }

      const targetPanel = isDetailOpenRef.current ? 1 : 0;
      if (reduced) {
        panelProgressRef.current = targetPanel;
        panelVelRef.current = 0;
      } else {
        const pOmega = 9.0;
        const pDiff = panelProgressRef.current - targetPanel;
        if (Math.abs(pDiff) < 0.0003 && Math.abs(panelVelRef.current) < 0.0005) {
          panelProgressRef.current = targetPanel;
          panelVelRef.current = 0;
        } else {
          const pExp = Math.exp(-pOmega * dt);
          const pTemp = (panelVelRef.current + pOmega * pDiff) * dt;
          panelVelRef.current = (panelVelRef.current - pOmega * pTemp) * pExp;
          panelProgressRef.current = targetPanel + (pDiff + pTemp) * pExp;
        }
      }

      const pos = posRef.current;
      const pProg = panelProgressRef.current;
      const mobile = isMobileRef.current;
      const stageW = stageWidthRef.current;
      const stageH = stageHeightRef.current;
      const viewH = viewportHeightRef.current;
      const footerH = footerHeightRef.current;
      const baseStep = mobile
        ? Math.max(155, stageW * 0.45)
        : Math.min(285, Math.max(180, stageW * 0.195));

      const activeSnapped = modIndex(Math.round(target));

      const sheetHeight = viewH * 0.56;
      const mobileTargetLift = Math.max(0, sheetHeight - footerH + 14);
      const mobileHeadroom = Math.max(140, viewH - sheetHeight - 76);
      const mobileTargetScale = Math.min(
        0.62,
        mobileHeadroom / Math.max(stageH * 0.92, 1)
      );

      if (lightPoolRef.current) {
        const lightShiftX = mobile ? 0 : desktopShiftXRef.current * pProg;
        const lightShiftY = mobile ? -mobileTargetLift * 0.65 * pProg : 0;
        lightPoolRef.current.style.transform = `translate3d(${lightShiftX.toFixed(2)}px, ${lightShiftY.toFixed(2)}px, 0)`;
      }

      for (let i = 0; i < LOOK_COUNT; i++) {
        const el = figureRefs.current[i];
        if (!el) continue;

        const d = wrappedDistance(i, pos);
        const metrics = getRailMetrics(d, baseStep);

        const isCenterTarget = i === activeSnapped;
        let x = metrics.x;
        let y = 0;
        let scale = metrics.scale;
        let opacity = metrics.opacity;

        if (pProg > 0.001) {
          if (isCenterTarget) {
            if (mobile) {
              x = metrics.x * (1 - pProg);
              y = -mobileTargetLift * pProg;
              scale = metrics.scale * (1 - pProg) + mobileTargetScale * pProg;
            } else {
              x = metrics.x * (1 - pProg) + desktopShiftXRef.current * pProg;
              scale = metrics.scale + 0.06 * pProg;
            }
          } else {
            opacity = metrics.opacity * (1 - pProg);
          }
        }

        const visible = opacity > 0.01;
        el.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
        el.style.opacity = opacity.toFixed(4);
        el.style.zIndex = String(
          isCenterTarget && pProg > 0.1 ? 35 : metrics.zIndex
        );
        el.style.pointerEvents =
          visible && (pProg < 0.1 || isCenterTarget) ? 'auto' : 'none';
        el.tabIndex = visible && (pProg < 0.1 || isCenterTarget) ? 0 : -1;
        el.setAttribute('aria-hidden', visible ? 'false' : 'true');
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  // Auto-advance: after 7s idle, step +1 every 4s (disabled if panel open or reducedMotion)
  useEffect(() => {
    if (reducedMotion || isDetailOpen || isBagOpen || activeEditorial) {
      return;
    }

    const interval = window.setInterval(() => {
      if (
        isDraggingRef.current ||
        isDetailOpenRef.current ||
        isModalOpenRef.current
      ) {
        return;
      }
      const elapsed = Date.now() - lastInputTimeRef.current;
      if (elapsed >= 7000) {
        targetRef.current = Math.round(targetRef.current) + 1;
        syncActiveIndex(targetRef.current);
        lastInputTimeRef.current = Date.now() - 3000;
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [reducedMotion, isDetailOpen, isBagOpen, activeEditorial, syncActiveIndex]);

  // Keyboard navigation: Left/Right arrows + Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeEditorial) {
          setActiveEditorial(null);
        } else if (isBagOpen) {
          setIsBagOpen(false);
        } else if (isDetailOpen) {
          setIsDetailOpen(false);
          recordUserInput();
        }
        return;
      }

      if (isDetailOpen || isBagOpen || activeEditorial) {
        return;
      }

      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepBy(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepBy(-1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDetailOpen, isBagOpen, activeEditorial, stepBy, recordUserInput]);

  // Sideways wheel / trackpad swipe listener
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (isDetailOpenRef.current || isModalOpenRef.current) return;

      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);

      if (absX > absY && absX > 4) {
        e.preventDefault();
        recordUserInput();

        const now = Date.now();
        if (now < wheelCooldownUntilRef.current) return;

        wheelAccumRef.current += e.deltaX;
        if (Math.abs(wheelAccumRef.current) >= 42) {
          const dir = wheelAccumRef.current > 0 ? 1 : -1;
          wheelAccumRef.current = 0;
          wheelCooldownUntilRef.current = now + 260;
          stepBy(dir);
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [recordUserInput, stepBy]);

  // Pointer drag / touch swipe handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDetailOpen || isBagOpen || activeEditorial) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    dragStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startTarget: targetRef.current,
      lastX: e.clientX,
      lastTime: performance.now(),
      velocity: 0,
      lock: null,
    };
    didDragRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const ds = dragStateRef.current;
    if (ds.pointerId !== e.pointerId) return;
    if (isDetailOpen) return;

    const dx = e.clientX - ds.startX;
    const dy = e.clientY - ds.startY;

    if (ds.lock === null) {
      if (Math.hypot(dx, dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        ds.lock = 'vertical';
        ds.pointerId = null;
        return;
      }
      ds.lock = 'horizontal';
      isDraggingRef.current = true;
      didDragRef.current = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture unavailable
      }
    }

    if (ds.lock === 'horizontal') {
      recordUserInput();
      const stageW = stageWidthRef.current;
      const baseStep = isMobile
        ? Math.max(155, stageW * 0.45)
        : Math.min(285, Math.max(180, stageW * 0.195));

      const now = performance.now();
      const dt = Math.max(8, now - ds.lastTime);
      const instantVel = (e.clientX - ds.lastX) / dt; // px / ms
      ds.velocity = ds.velocity * 0.55 + instantVel * 0.45;
      ds.lastX = e.clientX;
      ds.lastTime = now;

      targetRef.current = ds.startTarget - dx / baseStep;
      syncActiveIndex(targetRef.current);
    }
  };

  const endPointerDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const ds = dragStateRef.current;
    if (ds.pointerId !== e.pointerId) return;

    if (ds.lock === 'horizontal') {
      const stageW = stageWidthRef.current;
      const baseStep = isMobile
        ? Math.max(155, stageW * 0.45)
        : Math.min(285, Math.max(180, stageW * 0.195));

      // Hand off drag momentum into spring velocity for silky release settle
      const releaseVel = (-ds.velocity * 1000) / baseStep;
      velRef.current = Math.max(-6, Math.min(6, releaseVel));

      const flickSteps = Math.max(
        -1.35,
        Math.min(1.35, (-ds.velocity * 165) / baseStep)
      );
      targetRef.current = Math.round(targetRef.current + flickSteps);
      syncActiveIndex(targetRef.current);
      recordUserInput();

      window.setTimeout(() => {
        didDragRef.current = false;
      }, 60);
    }

    isDraggingRef.current = false;
    ds.pointerId = null;
    ds.lock = null;
  };

  const handleStageClick = () => {
    if (didDragRef.current) return;
    if (isDetailOpen) {
      setIsDetailOpen(false);
      recordUserInput();
    }
  };

  const handleFigureClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (didDragRef.current) return;

    recordUserInput();
    if (index === activeIndex) {
      setIsDetailOpen((prev) => !prev);
    } else if (isDetailOpen) {
      setIsDetailOpen(false);
    } else {
      goToLook(index);
    }
  };

  const handleSelectSize = useCallback((pieceId: string, sizeKey: string) => {
    setSelectedSizes((prev) => ({ ...prev, [pieceId]: sizeKey }));
  }, []);

  const handleAddLookToBag = useCallback(
    (look: Look, sizes: Record<string, string>) => {
      const lookIdx = LOOKS.findIndex((l) => l.id === look.id);
      const entry: BagEntry = {
        entryId: `${look.id}-${Date.now()}`,
        lookId: look.id,
        lookNumber: lookIdx + 1,
        image: look.image,
        items: look.pieces.map((p) => ({
          pieceId: p.id,
          price: p.price,
          sizeKey: sizes[p.id] || SIZE_OPTIONS[p.category][0].en,
        })),
        total: getLookTotal(look),
      };
      setBagEntries((prev) => [...prev, entry]);
    },
    []
  );

  const handleRemoveBagEntry = useCallback((entryId: string) => {
    setBagEntries((prev) => prev.filter((e) => e.entryId !== entryId));
  }, []);

  const currentLook = LOOKS[activeIndex];
  const currentTotal = useMemo(() => getLookTotal(currentLook), [currentLook]);
  const formattedIndex = String(activeIndex + 1).padStart(2, '0');
  const formattedCount = String(LOOK_COUNT).padStart(2, '0');

  return (
    <div
      className="relative flex h-dvh w-screen flex-col overflow-hidden select-none"
      style={{
        backgroundColor: currentLook.tint,
        transition: reducedMotion
          ? 'none'
          : 'background-color 950ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {/* BAND 1: Thin Navigation */}
      <header className="relative z-30 grid h-14 shrink-0 grid-cols-[1fr_auto] items-center gap-4 px-5 md:grid-cols-3 md:gap-8 md:px-10">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => {
              setIsDetailOpen(false);
              setActiveEditorial(null);
              setIsBagOpen(false);
              goToLook(0);
            }}
            className="font-serif text-2xl tracking-[0.06em] text-[#181615] uppercase whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#181615]"
          >
            {BRAND_CONFIG.name}
          </button>
        </div>

        <nav
          aria-label="Primary"
          className="hidden items-center justify-center gap-8 md:flex"
        >
          {BRAND_CONFIG.nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id === 'collection') {
                  setActiveEditorial(null);
                  setIsDetailOpen(false);
                } else {
                  setActiveEditorial(BRAND_CONFIG.editorial[item.id]);
                }
              }}
              className="sable-hover-underline text-[13px] font-medium tracking-[0.01em] text-[#181615]/80 transition-colors hover:text-[#181615] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#181615]"
            >
              {item.label[lang]}
            </button>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-4 md:gap-5">
          {/* Compact UZ / EN / RU language switcher */}
          <div
            role="group"
            aria-label="Language"
            className="flex items-center gap-1 rounded-full border border-black/12 bg-white/35 p-0.5 shrink-0"
          >
            {LANG_OPTIONS.map((opt) => {
              const active = lang === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLang(opt.id)}
                  aria-pressed={active}
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium tracking-[0.04em] whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#181615] ${
                    active
                      ? 'bg-[#181615] text-[#FAF8F5]'
                      : 'text-[#181615]/65 hover:text-[#181615]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsBagOpen(true)}
            aria-label={`${copy.bag} (${bagEntries.length})`}
            className="sable-hover-underline text-[13px] font-medium tracking-[0.01em] text-[#181615] tabular-nums whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#181615]"
          >
            {copy.bag} ({bagEntries.length})
          </button>
        </div>
      </header>

      {/* BAND 2: The Stage */}
      <main
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerDrag}
        onPointerCancel={endPointerDrag}
        onClick={handleStageClick}
        className="relative min-h-0 flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{
          touchAction: 'pan-y',
        }}
      >
        {/* Soft pool of light behind middle figure */}
        <div
          ref={lightPoolRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 1,
            background:
              'radial-gradient(ellipse 36% 62% at 50% 50%, rgba(255, 255, 255, 0.62) 0%, rgba(255, 255, 255, 0.22) 48%, rgba(255, 255, 255, 0) 76%)',
          }}
        />

        {/* Giant uppercase serif word behind the figures */}
        <LookWordBackdrop
          word={currentLook.word[lang]}
          color={currentLook.wordColor}
          isDetailOpen={isDetailOpen}
          isMobile={isMobile}
          desktopShiftX={desktopShiftX}
          reducedMotion={reducedMotion}
        />

        {/* Figure Rail: all figures stand with feet on one shared floor line */}
        <div
          aria-label="Lookbook rail"
          className="pointer-events-none absolute inset-x-0 top-3 bottom-3 md:top-4 md:bottom-5"
          style={{ zIndex: 10 }}
        >
          {LOOKS.map((look, index) => {
            const initialDist = Math.abs(wrappedDistance(index, 0));
            const entranceDelayMs = Math.round(initialDist * 95);
            const isCenter = index === activeIndex;
            const hasFailed = Boolean(failedImages[look.id]);
            const lookNum = String(index + 1).padStart(2, '0');

            return (
              <button
                key={look.id}
                ref={(el) => {
                  figureRefs.current[index] = el;
                }}
                type="button"
                onClick={(e) => handleFigureClick(e, index)}
                aria-label={
                  isCenter
                    ? isDetailOpen
                      ? `${copy.lookWord} ${lookNum} (${look.title[lang]}) — ${copy.closeLookDetails}`
                      : `${copy.lookWord} ${lookNum} (${look.title[lang]}) — ${copy.inspectLook}`
                    : `${copy.lookWord} ${lookNum} (${look.title[lang]}) — ${copy.bringToCenter}`
                }
                className="group absolute bottom-0 left-1/2 h-full max-h-[92%] origin-bottom cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#181615]"
                style={{
                  aspectRatio: String(look.aspectRatio),
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                }}
              >
                <div
                  className="sable-figure-enter relative flex h-full w-full items-end justify-center"
                  style={{
                    animationDelay: `${entranceDelayMs}ms`,
                  }}
                >
                  {/* Soft elliptical shadow at the model's feet */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-1.5 left-1/2 h-3.5 w-[86%] -translate-x-1/2 rounded-full"
                    style={{
                      background:
                        'radial-gradient(ellipse at center, rgba(24, 22, 21, 0.25) 0%, rgba(24, 22, 21, 0.09) 48%, rgba(24, 22, 21, 0) 76%)',
                    }}
                  />

                  {hasFailed ? (
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-t-full border border-black/10 bg-black/[0.04] px-3 text-center">
                      <span className="font-serif text-xl text-[#181615]">
                        {look.word[lang]}
                      </span>
                      <span className="mt-1 text-[11px] text-[#181615]/60">
                        {look.title[lang]}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={look.image}
                      alt={`${copy.lookWord} ${lookNum} — ${look.title[lang]}`}
                      referrerPolicy="no-referrer"
                      draggable={false}
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [look.id]: true }))
                      }
                      className="relative z-10 block h-full w-full object-contain object-bottom pointer-events-none select-none"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* BAND 3: Info Band */}
      <footer
        ref={footerRef}
        inert={isDetailOpen ? true : undefined}
        className="relative z-20 shrink-0 border-t border-black/8 px-5 pt-3 pb-4 md:px-10 md:pt-4 md:pb-6"
        style={{
          opacity: isDetailOpen ? 0 : 1,
          pointerEvents: isDetailOpen ? 'none' : 'auto',
          transition: reducedMotion
            ? 'none'
            : 'opacity 420ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-3 md:gap-6">
          {/* Left: Look index, serif title, and clickable piece list (hidden on phone) */}
          <div
            key={`info-left-${activeIndex}-${lang}`}
            className="sable-info-reveal min-w-0"
          >
            <div className="flex items-baseline justify-between gap-3 md:block">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#181615]/60 tabular-nums">
                {copy.lookWord} {formattedIndex} / {formattedCount}
              </p>
              <span className="text-[13px] font-medium text-[#181615] tabular-nums md:hidden">
                {formatPrice(currentTotal, lang)}
              </span>
            </div>

            <h1 className="mt-0.5 font-serif text-2xl leading-[1.08] text-[#181615] md:text-[2rem]">
              {currentLook.title[lang]}
            </h1>

            <ul className="mt-2 hidden space-y-1 md:block">
              {currentLook.pieces.map((piece) => (
                <li key={piece.id}>
                  <button
                    type="button"
                    onClick={() => {
                      recordUserInput();
                      setIsDetailOpen(true);
                    }}
                    className="sable-hover-piece flex w-full max-w-[380px] items-baseline justify-between gap-4 text-left text-[12px] text-[#181615]/72 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181615]"
                  >
                    <span className="truncate">{piece.name[lang]}</span>
                    <span className="shrink-0 tabular-nums">
                      {formatPrice(piece.price, lang)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Center: Round arrow buttons & 8 look ticks */}
          <div className="flex items-center justify-between gap-4 md:flex-col md:justify-end md:gap-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => stepBy(-1)}
                aria-label={copy.prevLook}
                className="sable-hover-btn flex h-10 w-10 items-center justify-center rounded-full border border-black/18 text-[#181615] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181615]"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>

              <div
                role="tablist"
                aria-label="Looks"
                className="flex items-center gap-1.5 px-1"
              >
                {LOOKS.map((look, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={look.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`${copy.lookWord} ${String(idx + 1).padStart(2, '0')}: ${look.title[lang]}`}
                      onClick={() => goToLook(idx)}
                      className="flex h-8 min-w-[14px] items-center justify-center px-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181615]"
                    >
                      <span
                        className="block h-[2px] rounded-full transition-all"
                        style={{
                          width: isActive ? '22px' : '10px',
                          backgroundColor: isActive
                            ? '#181615'
                            : 'rgba(24, 22, 21, 0.26)',
                          transitionDuration: reducedMotion ? '0ms' : '380ms',
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => stepBy(1)}
                aria-label={copy.nextLook}
                className="sable-hover-btn flex h-10 w-10 items-center justify-center rounded-full border border-black/18 text-[#181615] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181615]"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Right: Total and "Shop the look" pill */}
          <div
            key={`info-right-${activeIndex}-${lang}`}
            className="sable-info-reveal flex items-center justify-end gap-4"
          >
            <div className="hidden text-right md:block">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#181615]/55">
                {copy.lookTotal}
              </p>
              <p className="font-serif text-2xl leading-none text-[#181615] tabular-nums">
                {formatPrice(currentTotal, lang)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                recordUserInput();
                setIsDetailOpen(true);
              }}
              className="sable-hover-cta flex h-10 w-full items-center justify-center rounded-full bg-[#181615] px-6 text-[13px] font-medium tracking-[0.02em] text-[#FAF8F5] whitespace-nowrap shrink-0 transition-colors md:h-11 md:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181615]"
            >
              {copy.shopTheLook}
            </button>
          </div>
        </div>
      </footer>

      {/* Product Detail Panel (Desktop column / Mobile bottom sheet) */}
      <LookDetailPanel
        lang={lang}
        look={currentLook}
        lookNumber={activeIndex + 1}
        totalLooks={LOOK_COUNT}
        isOpen={isDetailOpen}
        isMobile={isMobile}
        reducedMotion={reducedMotion}
        selectedSizes={selectedSizes}
        onSelectSize={handleSelectSize}
        onAddLookToBag={handleAddLookToBag}
        onClose={() => {
          setIsDetailOpen(false);
          recordUserInput();
        }}
      />

      {/* Shopping Bag Drawer */}
      <BagDrawer
        lang={lang}
        isOpen={isBagOpen}
        entries={bagEntries}
        reducedMotion={reducedMotion}
        onRemoveEntry={handleRemoveBagEntry}
        onClose={() => setIsBagOpen(false)}
      />

      {/* Editorial Modal for Atelier / Campaign / Stockists */}
      <EditorialModal
        lang={lang}
        section={activeEditorial}
        reducedMotion={reducedMotion}
        onClose={() => setActiveEditorial(null)}
      />
    </div>
  );
}
