import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  BrainCircuitIcon,
  CheckCircle2Icon,
  LineChartIcon,
  PieChartIcon,
  ReceiptIndianRupeeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon } from
'lucide-react';
import { Logo } from '../components/layout/Logo';
import { Button, ButtonLink } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Disclaimer } from '../components/ui/Bits';
import { useNexmove } from '../contexts/NexmoveContext';
import { BRAND_IMAGE } from '../data/demo';
import { DashboardPreview } from '../components/landing/DashboardPreview';

const reasons = [
{
  icon: ShieldCheckIcon,
  title: 'Understand your risk',
  body: 'A guided risk profile that explains why you got your score — not just a number on a dial.'
},
{
  icon: PieChartIcon,
  title: 'Track all investments',
  body: 'Stocks, mutual funds, SIPs, ETFs, FDs and gold consolidated into one honest view.'
},
{
  icon: TargetIcon,
  title: 'Plan financial goals',
  body: 'Turn “buy a laptop” or “higher education” into a monthly number you can actually act on.'
},
{
  icon: ReceiptIndianRupeeIcon,
  title: 'Analyze spending',
  body: 'See where money actually goes each month and which category quietly grew.'
},
{
  icon: LineChartIcon,
  title: 'Understand market data',
  body: 'Context and fundamentals instead of screenshots and social-media hype.'
},
{
  icon: BrainCircuitIcon,
  title: 'Get personalized insights',
  body: 'NEX AI explains your money in plain language and suggests your next move.'
}];


const journey = [
'Financial profile',
'Risk profile',
'Health score',
'Portfolio',
'Goals & spending',
'Your next move'];


export function Landing() {
  const { startDemo } = useNexmove();
  const navigate = useNavigate();

  const handleDemo = () => {
    startDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex" aria-label="Landing navigation">
            <a href="#why" className="text-sm font-medium text-muted hover:text-ink">
              Why NEXMOVE
            </a>
            <a href="#journey" className="text-sm font-medium text-muted hover:text-ink">
              How it works
            </a>
            <a href="#responsible" className="text-sm font-medium text-muted hover:text-ink">
              Responsible finance
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ButtonLink to="/sign-in" variant="secondary" size="sm">
              Sign in
            </ButtonLink>
            <Button size="sm" onClick={handleDemo}>
              Try Demo Account
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-brand-600">
              <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
              WealthTech for students, professionals & first-time investors
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[56px]">
              Your Money. Your Goals.
              <br />
              <span className="text-brand-500">Your Next Move.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Turn complex financial and market data into simple, personalized
              insights that help you invest, save, budget and plan with
              confidence.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/onboarding" size="lg">
                Build My Financial Plan
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <Button variant="secondary" size="lg" onClick={handleDemo}>
                Explore NEXMOVE
              </Button>
            </div>
            <dl className="mt-9 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
              {[
              ['7 modules', 'One connected plan'],
              ['0–100', 'Financial health score'],
              ['Plain English', 'No jargon required']].
              map(([value, label]) =>
              <div key={label}>
                  <dt className="text-sm font-bold text-ink">{value}</dt>
                  <dd className="mt-0.5 text-xs text-muted">{label}</dd>
                </div>
              )}
            </dl>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}>
            
            <DashboardPreview />
          </motion.div>
        </section>

        <section id="why" className="border-y border-line bg-surface/60 py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Why NEXMOVE?
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
              Financial literacy in India is growing, but financial confidence is
              not. NEXMOVE closes that gap by making every number explain itself.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reasons.map((r) =>
              <Card key={r.title} className="flex h-full flex-col p-5">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <r.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold text-ink">{r.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {r.body}
                  </p>
                </Card>
              )}
            </div>
          </div>
        </section>

        <section id="journey" className="py-14">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                From scattered data to a confident decision
              </h2>
              <p className="mt-2 text-sm text-muted sm:text-base">
                Every module feeds the next, so the advice you see is built on
                your full financial picture rather than an isolated number.
              </p>
              <ol className="mt-6 space-y-3">
                {journey.map((step, i) =>
                <li key={step} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-ink">{step}</span>
                  </li>
                )}
              </ol>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button onClick={handleDemo}>Try Demo Account</Button>
                <ButtonLink to="/onboarding" variant="secondary">
                  Start my profile
                </ButtonLink>
              </div>
            </div>
            <Card className="overflow-hidden">
              <img
                src={BRAND_IMAGE}
                alt="NEXMOVE brand mark with the tagline Your Next Financial Move"
                className="h-full w-full object-cover" />
              
            </Card>
          </div>
        </section>

        <section id="responsible" className="border-t border-line bg-surface/60 py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Built for responsible finance
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                  NEXMOVE never promises guaranteed returns or “sure-shot”
                  stocks. It explains uncertainty, encourages emergency savings
                  and diversification, and separates education from advice.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {[
                  'Every projection states its assumptions',
                  'Risk is explained before any product',
                  'Hype is compared against real data',
                  'Educational insights, never a sales pitch'].
                  map((point) =>
                  <li key={point} className="flex items-start gap-2 text-sm text-ink">
                      <CheckCircle2Icon
                      className="mt-0.5 h-4 w-4 shrink-0 text-emeraldx-500"
                      aria-hidden="true" />
                    
                      {point}
                    </li>
                  )}
                </ul>
              </div>
              <Card className="p-6">
                <h3 className="text-base font-semibold text-ink">
                  Hype vs Data, in one view
                </h3>
                <div className="mt-4 rounded-xl border border-line bg-canvas p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Social media says
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink">
                    “Everyone is buying this stock!”
                  </p>
                </div>
                <div className="mt-3 rounded-xl border border-brand-100 bg-brand-50 p-4 dark:border-navy-600 dark:bg-navy-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                    NEXMOVE data view
                  </p>
                  <p className="mt-1 text-sm text-ink">
                    Valuation 68x vs sector 24x · High volatility · Debt above
                    peers · Most gains in the last 7 months.
                  </p>
                </div>
                <p className="mt-4 text-sm font-semibold text-ink">
                  Don’t invest because of hype. Understand the data first.
                </p>
              </Card>
            </div>
            <Disclaimer />
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo showTagline />
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} NEXMOVE · Educational prototype ·{' '}
            <Link to="/sign-in" className="font-semibold text-brand-600">
              Sign in
            </Link>
          </p>
        </div>
      </footer>
    </div>);

}