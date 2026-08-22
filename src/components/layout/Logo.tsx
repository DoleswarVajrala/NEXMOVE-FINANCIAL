import React from 'react';
import { Link } from 'react-router-dom';

export function Logo({
  to = '/',
  showTagline = false



}: {to?: string;showTagline?: boolean;}) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      aria-label="NEXMOVE home">
      
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 text-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M4 19V6l8 9V6"
            fill="none"
            stroke="#08b9d6"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round" />
          
          <path
            d="M14 14l5-5m0 0h-4m4 0v4"
            fill="none"
            stroke="#12a875"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round" />
          
        </svg>
      </span>
      <span className="leading-none">
        <span className="block text-[17px] font-extrabold tracking-tight text-ink">
          NEX<span className="text-brand-500">MOVE</span>
        </span>
        {showTagline &&
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            Your Next Financial Move
          </span>
        }
      </span>
    </Link>);

}