import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BellIcon,
  LogOutIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  UserIcon } from
'lucide-react';
import { useNexmove } from '../../contexts/NexmoveContext';
import { navItems } from './navItems';
import { Logo } from './Logo';

export function Header() {
  const { profile, unreadCount, theme, toggleTheme, signOut } = useNexmove();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const results = query ?
  navItems.filter((i) =>
  i.label.toLowerCase().includes(query.trim().toLowerCase())
  ) :
  [];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <div className="lg:hidden">
          <Logo to="/dashboard" />
        </div>

        <div className="relative ml-auto w-full max-w-xs lg:ml-0 lg:max-w-sm">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true" />
          
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search NEXMOVE"
            aria-label="Search NEXMOVE sections"
            className="h-10 w-full rounded-xl border border-line bg-canvas pl-9 pr-3 text-sm text-ink placeholder:text-muted/80 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/25" />
          
          {query &&
          <div className="absolute left-0 right-0 top-12 overflow-hidden rounded-xl border border-line bg-surface shadow-lift">
              {results.length === 0 ?
            <p className="px-3 py-3 text-sm text-muted">
                  No section matches “{query}”.
                </p> :

            <ul>
                  {results.map((r) =>
              <li key={r.path}>
                      <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    navigate(r.path);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-ink hover:bg-brand-50 dark:hover:bg-navy-800">
                  
                        <r.icon className="h-4 w-4 text-brand-500" aria-hidden="true" />
                        {r.label}
                      </button>
                    </li>
              )}
                </ul>
            }
            </div>
          }
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-muted transition-colors duration-150 ease-out hover:text-brand-600">
            
            {theme === 'light' ?
            <MoonIcon className="h-4 w-4" aria-hidden="true" /> :

            <SunIcon className="h-4 w-4" aria-hidden="true" />
            }
          </button>
          <Link
            to="/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-line text-muted transition-colors duration-150 ease-out hover:text-brand-600"
            aria-label={`Notifications, ${unreadCount} unread`}>
            
            <BellIcon className="h-4 w-4" aria-hidden="true" />
            {unreadCount > 0 &&
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-attention-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            }
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-xl border border-line px-2 py-1.5 transition-colors duration-150 ease-out hover:border-brand-400">
            
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-xs font-bold text-white">
              {profile.name ? profile.name.charAt(0).toUpperCase() : <UserIcon className="h-3.5 w-3.5" />}
            </span>
            <span className="hidden text-sm font-medium text-ink sm:block">
              {profile.name || 'Profile'}
            </span>
          </Link>
          <button
            type="button"
            onClick={signOut}
            aria-label="Sign out"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-line text-muted transition-colors duration-150 ease-out hover:text-danger-500 sm:flex">
            
            <LogOutIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>);

}