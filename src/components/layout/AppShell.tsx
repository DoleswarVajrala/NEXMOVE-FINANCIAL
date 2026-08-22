import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { useNexmove } from '../../contexts/NexmoveContext';

export function AppShell() {
  const { signedIn } = useNexmove();
  const location = useLocation();

  if (!signedIn) return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;

  return (
    <div className="flex min-h-screen w-full bg-canvas">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="nx-scroll flex-1 px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
          
          <Outlet />
        </motion.main>
      </div>
      <MobileNav />
    </div>);

}