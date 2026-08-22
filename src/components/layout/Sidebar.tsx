import React from 'react';
import { NavLink } from 'react-router-dom';
import { SparklesIcon } from 'lucide-react';
import { Logo } from './Logo';
import { navItems } from './navItems';
import { useNexmove } from '../../contexts/NexmoveContext';

const groups: Array<'Overview' | 'Decisions' | 'Grow'> = [
'Overview',
'Decisions',
'Grow'];


export function Sidebar() {
  const { demoMode, unreadCount } = useNexmove();

  return (
    <aside className="hidden w-[248px] shrink-0 flex-col border-r border-line bg-surface/80 lg:flex">
      <div className="px-5 py-5">
        <Logo to="/dashboard" showTagline />
      </div>
      <nav
        className="nx-scroll flex-1 overflow-y-auto px-3 pb-4"
        aria-label="Main navigation">
        
        {groups.map((group) =>
        <div key={group} className="mb-4">
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
              {group}
            </p>
            <ul className="space-y-0.5">
              {navItems.
            filter((item) => item.group === group).
            map((item) =>
            <li key={item.path}>
                    <NavLink
                to={item.path}
                className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out ${
                isActive ?
                'bg-brand-500 text-white' :
                'text-muted hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-navy-800'}`

                }>
                
                      <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                      {item.path === '/notifications' && unreadCount > 0 &&
                <span className="ml-auto rounded-full bg-attention-500 px-1.5 text-[11px] font-bold text-white">
                          {unreadCount}
                        </span>
                }
                    </NavLink>
                  </li>
            )}
          </ul>
          </div>
        )}
      </nav>
      <div className="border-t border-line px-4 py-4">
        {demoMode &&
        <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emeraldx-100 px-2.5 py-1 text-[11px] font-semibold text-emeraldx-600">
            <SparklesIcon className="h-3 w-3" aria-hidden="true" /> Demo data active
          </p>
        }
        <p className="text-[11px] leading-relaxed text-muted">
          Educational insights only. Investment decisions involve risk.
        </p>
      </div>
    </aside>);

}