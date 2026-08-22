import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
}

export function Card({ children, className = '', as = 'div' }: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={`rounded-2xl border border-line bg-surface/90 shadow-card backdrop-blur-sm ${className}`}>
      
      {children}
    </Tag>);

}

export function CardHeader({
  title,
  subtitle,
  action




}: {title: string;subtitle?: string;action?: React.ReactNode;}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
      <div>
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>);

}