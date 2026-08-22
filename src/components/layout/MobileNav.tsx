import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuIcon, XIcon } from 'lucide-react';
import { mobilePrimary, navItems } from './navItems';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const secondary = navItems.filter(
    (i) => !mobilePrimary.some((p) => p.path === i.path)
  );

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur lg:hidden"
        aria-label="Primary mobile navigation">
        
        <ul className="grid grid-cols-5">
          {mobilePrimary.map((item) =>
          <li key={item.path}>
              <NavLink
              to={item.path}
              className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
              isActive ? 'text-brand-600' : 'text-muted'}`

              }>
              
                <item.icon className="h-5 w-5" aria-hidden="true" />
                {item.label.replace('My ', '')}
              </NavLink>
            </li>
          )}
          <li>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted"
              aria-haspopup="dialog">
              
              <MenuIcon className="h-5 w-5" aria-hidden="true" />
              More
            </button>
          </li>
        </ul>
      </nav>

      <AnimatePresence>
        {open &&
        <motion.div
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}>
          
            <div
            className="absolute inset-0 bg-navy-900/45"
            onClick={() => setOpen(false)} />
          
            <motion.div
            role="dialog"
            aria-label="All sections"
            className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-line bg-surface p-5"
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            exit={{ y: 40 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
            
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-ink">All sections</h2>
                <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-line text-muted">
                
                  <XIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <ul className="grid grid-cols-2 gap-2 pb-4">
                {secondary.map((item) =>
              <li key={item.path}>
                    <NavLink
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 rounded-xl border border-line px-3 py-3 text-sm font-medium ${
                  location.pathname === item.path ?
                  'border-brand-400 text-brand-600' :
                  'text-ink'}`
                  }>
                  
                      <item.icon className="h-4 w-4 text-brand-500" aria-hidden="true" />
                      {item.label}
                    </NavLink>
                  </li>
              )}
              </ul>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}