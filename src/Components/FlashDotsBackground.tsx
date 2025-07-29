import React, { useEffect, useMemo, useRef } from 'react';

/**
 * FlashDotsBackground
 * A non-intrusive animated background of softly flashing dots.
 *
 * Implementation notes:
 * - Uses refs + direct class toggling to avoid React re-renders per flash.
 * - Each dot schedules its own flash cycle with randomized idle delays.
 * - Respects prefers-reduced-motion: renders static dim dots when enabled.
 */
export interface FlashDotsBackgroundProps {
  dotCount?: number;
  colors?: string[]; // small palette
  flashDurationMs?: number; // length of a single flash (up -> peak -> down)
  minIdleMs?: number; // minimum wait between flashes for a dot
  maxIdleMs?: number; // maximum wait between flashes for a dot
  className?: string;
  style?: React.CSSProperties;
  reducedMotionFallback?: 'static' | 'dim' | 'hidden';
}

interface DotMeta {
  id: number;
  xPct: number;
  yPct: number;
  size: number;
  color: string;
  ref: HTMLDivElement | null;
  timeoutId?: number;
}

const DEFAULT_COLORS = ['#ffffff', '#ffd6a5', '#caffbf'];

export const FlashDotsBackground: React.FC<FlashDotsBackgroundProps> = ({
  dotCount = 120,
  colors = DEFAULT_COLORS,
  flashDurationMs = 900,
  minIdleMs = 1500,
  maxIdleMs = 6000,
  className = '',
  style,
  reducedMotionFallback = 'static',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<DotMeta[]>([]);
  const reducedMotion = useRef(false);
  const cleanupRef = useRef<() => void>(() => {});

  // Generate dots one-time (based on dotCount & colors)
  const dots = useMemo(() => {
    return Array.from({ length: dotCount }).map((_, i) => {
      return {
        id: i,
        xPct: Math.random() * 100,
        yPct: Math.random() * 100,
        size: 2 + Math.random() * 3, // 2-5px
        color: colors[i % colors.length], // simple distribution
        ref: null as HTMLDivElement | null,
      } as DotMeta;
    });
  }, [dotCount, colors]);

  dotsRef.current = dots; // keep current pointer updated

  // Flash scheduling logic
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = mq.matches;

    const listeners: Array<() => void> = [];
    const handleChange = () => {
      reducedMotion.current = mq.matches;
      // If user toggles reduced motion while active, we could (future) re-init.
    };
    mq.addEventListener('change', handleChange);
    listeners.push(() => mq.removeEventListener('change', handleChange));

    if (reducedMotion.current) {
      // No scheduling; just static fallback.
      cleanupRef.current = () => {
        listeners.forEach(l => l());
      };
      return () => cleanupRef.current();
    }

    const timeouts: number[] = [];

    const scheduleFlash = (dot: DotMeta) => {
      const idle = minIdleMs + Math.random() * (maxIdleMs - minIdleMs);
      const timeoutId = window.setTimeout(() => {
        if (!dot.ref) return;
        dot.ref.classList.add('fdb-dot-flash');
        // Remove flash class after duration
        const removeId = window.setTimeout(() => {
          dot.ref && dot.ref.classList.remove('fdb-dot-flash');
          scheduleFlash(dot); // schedule next cycle
        }, flashDurationMs);
        timeouts.push(removeId);
      }, idle);
      dot.timeoutId = timeoutId;
      timeouts.push(timeoutId);
    };

    dotsRef.current.forEach(scheduleFlash);

    cleanupRef.current = () => {
      timeouts.forEach(id => clearTimeout(id));
      listeners.forEach(l => l());
    };

    return () => cleanupRef.current();
  }, [minIdleMs, maxIdleMs, flashDurationMs]);

  return (
    <div
      ref={containerRef}
      className={`fdb-container ${className}`}
      style={style}
      aria-hidden="true"
    >
      {dots.map(d => (
        <div
          key={d.id}
          ref={el => (d.ref = el)}
          className="fdb-dot"
          style={{
            left: `${d.xPct}%`,
            top: `${d.yPct}%`,
            width: d.size,
            height: d.size,
            backgroundColor: d.color,
            opacity:
              reducedMotion.current && reducedMotionFallback === 'dim'
                ? 0.2
                : undefined,
            display:
              reducedMotion.current && reducedMotionFallback === 'hidden'
                ? 'none'
                : undefined,
          }}
        />
      ))}
      <style>{`
        .fdb-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none; /* allow clicks through to content */
          z-index: 0;
        }
        .fdb-dot {
          position: absolute;
          border-radius: 50%;
          opacity: 0.15;
          transform: scale(1);
          transition: opacity ${flashDurationMs * 0.4}ms ease, transform ${flashDurationMs * 0.4}ms ease;
          will-change: opacity, transform;
        }
        .fdb-dot-flash {
          opacity: 1 !important;
          transform: scale(1.6);
          filter: drop-shadow(0 0 4px rgba(255,255,255,0.6));
        }
        @media (prefers-reduced-motion: reduce) {
          .fdb-dot { transition: none; }
        }
      `}</style>
    </div>
  );
};

export default FlashDotsBackground;
