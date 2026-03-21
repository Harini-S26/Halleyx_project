import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const PERIODS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function TimelineSlider({ value, onChange }) {
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        onChange(prev => {
          if (prev >= 100) { setPlaying(false); return 100; }
          return prev + 1;
        });
      }, 80);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const periodIndex = Math.floor((value / 100) * (PERIODS.length - 1));

  return (
    <div className="card p-3 flex items-center gap-4">
      <button
        onClick={() => setPlaying(p => !p)}
        className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors flex items-center justify-center flex-shrink-0"
      >
        {playing ? <Pause size={13} /> : <Play size={13} />}
      </button>

      <button
        onClick={() => { onChange(0); setPlaying(false); }}
        className="w-8 h-8 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors flex items-center justify-center flex-shrink-0"
      >
        <RotateCcw size={13} />
      </button>

      <div className="flex items-center gap-1 flex-shrink-0">
        <span className="text-xs text-zinc-400 font-medium">Time Travel</span>
      </div>

      <div className="flex-1 relative">
        <input
          type="range" min="0" max="100" value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-1.5 appearance-none rounded-full cursor-pointer accent-brand-500"
          style={{ background: `linear-gradient(to right, #6366f1 ${value}%, #e4e4e7 ${value}%)` }}
        />
        <div className="flex justify-between mt-1">
          {PERIODS.filter((_, i) => i % 3 === 0).map(p => (
            <span key={p} className="text-[10px] text-zinc-300 font-mono">{p}</span>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 w-12 text-right">
        <span className="text-xs font-bold text-brand-600">{PERIODS[periodIndex]}</span>
      </div>
    </div>
  );
}
