import React from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost' | 'subtle';
type Size = 'sm' | 'md' | 'lg';

const base =
'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-[background-color,color,border-color,transform,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-px';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-lift',
  secondary:
  'border border-line bg-surface text-ink hover:border-brand-400 hover:text-brand-600',
  ghost: 'text-brand-600 hover:bg-brand-50 dark:hover:bg-navy-800',
  subtle: 'bg-navy-900 text-white hover:bg-navy-800'
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base'
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}>
      
      {children}
    </button>);

}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  children
}: CommonProps & {to: string;}) {
  return (
    <Link
      to={to}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      
      {children}
    </Link>);

}