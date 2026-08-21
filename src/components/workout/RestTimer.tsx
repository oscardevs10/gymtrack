import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward } from 'lucide-react';

interface RestTimerProps {
  seconds: number;
  onFinish: () => void;
  onSkip: () => void;
  onAddTime: (seconds: number) => void;
}

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function RestTimer({ seconds, onFinish, onSkip, onAddTime }: RestTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [total, setTotal] = useState(seconds);
  const [paused, setPaused] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    setRemaining(seconds);
    setTotal(seconds);
    finishedRef.current = false;
  }, [seconds]);

  useEffect(() => {
    if (paused) return;
    if (remaining <= 0) {
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinish();
      }
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, paused, onFinish]);

  const mm = Math.floor(Math.max(0, remaining) / 60)
    .toString()
    .padStart(2, '0');
  const ss = Math.max(0, remaining % 60)
    .toString()
    .padStart(2, '0');
  const progress = total > 0 ? remaining / total : 0;
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="relative w-56 h-56 flex items-center justify-center">
        <svg width="224" height="224" className="-rotate-90">
          <circle cx="112" cy="112" r={RADIUS} stroke="#2a2a32" strokeWidth="10" fill="none" />
          <circle
            cx="112"
            cy="112"
            r={RADIUS}
            stroke="#8b5cf6"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-display text-6xl text-text tabular-nums">
            {mm}:{ss}
          </span>
          <span className="text-xs text-text-muted tracking-[0.2em] uppercase mt-2 font-semibold">
            {remaining <= 0 ? 'Listo' : 'Descansando'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onAddTime(30)}
          className="px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-sm font-medium hover:bg-surface-3"
        >
          +30s
        </button>
        <button
          onClick={() => setPaused((p) => !p)}
          className="w-12 h-12 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text hover:bg-surface-3"
        >
          {paused ? <Play size={18} /> : <Pause size={18} />}
        </button>
        <button
          onClick={onSkip}
          className="px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-sm font-medium hover:bg-surface-3 flex items-center gap-1.5"
        >
          Omitir <SkipForward size={14} />
        </button>
      </div>
    </div>
  );
}
