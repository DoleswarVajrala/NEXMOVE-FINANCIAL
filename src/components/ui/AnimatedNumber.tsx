import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  format: (value: number) => string;
  className?: string;
}

export function AnimatedNumber({
  value,
  format,
  className = ''
}: AnimatedNumberProps) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);
  const frame = useRef<number>();

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const from = display;
    const duration = 600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduce]);

  return <span className={`nx-num ${className}`}>{format(display)}</span>;
}