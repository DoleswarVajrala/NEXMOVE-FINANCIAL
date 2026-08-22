import React from 'react';
import { InfoIcon } from 'lucide-react';
import { DISCLAIMER } from '../../data/demo';

export function PageHeader({
  title,
  subtitle,
  action




}: {title: string;subtitle?: string;action?: React.ReactNode;}) {
  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[28px]">
          {title}
        </h1>
        {subtitle &&
        <p className="mt-1 max-w-2xl text-sm text-muted">{subtitle}</p>
        }
      </div>
      {action}
    </header>);

}

const toneMap: Record<string, string> = {
  positive: 'bg-emeraldx-100 text-emeraldx-600',
  info: 'bg-brand-50 text-brand-600',
  attention: 'bg-attention-100 text-attention-600',
  caution: 'bg-attention-100 text-attention-600',
  danger: 'bg-danger-100 text-danger-600',
  neutral: 'bg-navy-50 text-navy-600 dark:bg-navy-800 dark:text-navy-100'
};

export function Badge({
  children,
  tone = 'neutral'



}: {children: React.ReactNode;tone?: keyof typeof toneMap;}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${toneMap[tone]}`}>
      
      {children}
    </span>);

}

export function Disclaimer({ compact = false }: {compact?: boolean;}) {
  return (
    <p
      className={`flex items-start gap-2 rounded-xl border border-line bg-surface/70 px-3 py-2 text-xs leading-relaxed text-muted ${
      compact ? '' : 'mt-8'}`
      }>
      
      <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{DISCLAIMER}</span>
    </p>);

}

export function EmptyState({
  icon,
  title,
  body,
  action





}: {icon: React.ReactNode;title: string;body: string;action?: React.ReactNode;}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>);

}

export function Field({
  label,
  hint,
  children,
  htmlFor





}: {label: string;hint?: string;children: React.ReactNode;htmlFor?: string;}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-ink">
        
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>);

}

export const inputClass =
'w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 transition-colors duration-150 ease-out focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30';

export function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display








}: {label: string;value: number;min: number;max: number;step?: number;onChange: (value: number) => void;display: string;}) {
  const id = `slider-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        <span className="nx-num rounded-lg bg-brand-50 px-2 py-1 text-sm font-semibold text-brand-600">
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full" />
      
    </div>);

}

export function Skeleton({ className = '' }: {className?: string;}) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-navy-50 dark:bg-navy-800 ${className}`} />);


}