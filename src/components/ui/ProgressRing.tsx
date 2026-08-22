import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 148,
  stroke = 12,
  label,
  sublabel,
  color = '#1463ff'
}: ProgressRingProps) {
  const reduce = useReducedMotion();
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value / max));

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label ?? 'Progress'}: ${Math.round(value)} out of ${max}`}>
      
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--nx-border)"
          strokeWidth={stroke} />
        
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: reduce ? circumference * (1 - pct) : circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct) }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }} />
        
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="nx-num text-3xl font-bold text-ink">
          {Math.round(value)}
        </span>
        {label && <span className="text-xs font-medium text-muted">{label}</span>}
        {sublabel &&
        <span className="mt-0.5 text-xs font-semibold" style={{ color }}>
            {sublabel}
          </span>
        }
      </div>
    </div>);

}