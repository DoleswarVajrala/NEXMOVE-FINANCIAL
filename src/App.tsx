import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { NexmoveProvider } from './contexts/NexmoveContext';
import { AppShell } from './components/layout/AppShell';
import { Landing } from './pages/Landing';
import { SignIn } from './pages/SignIn';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Portfolio } from './pages/Portfolio';
import { Goals } from './pages/Goals';
import { BudgetPage } from './pages/BudgetPage';
import { Spending } from './pages/Spending';
import { RiskProfile } from './pages/RiskProfile';
import { MarketInsights } from './pages/MarketInsights';
import { NexAI } from './pages/NexAI';
import { WhatIf } from './pages/WhatIf';
import { Calculators } from './pages/Calculators';
import { Learn } from './pages/Learn';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';

export function App() {
  return (
    <NexmoveProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/spending" element={<Spending />} />
            <Route path="/risk" element={<RiskProfile />} />
            <Route path="/market" element={<MarketInsights />} />
            <Route path="/nex-ai" element={<NexAI />} />
            <Route path="/what-if" element={<WhatIf />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
    </NexmoveProvider>);

}