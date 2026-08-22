import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeftIcon, ArrowRightIcon, RefreshCwIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Badge, Disclaimer, PageHeader } from '../components/ui/Bits';
import { useNexmove } from '../contexts/NexmoveContext';
import {
  riskExplanations,
  riskQuestions,
  suggestedAllocation } from
'../data/riskQuestions';
import { equityExposure } from '../utils/finance';

export function RiskProfile() {
  const { riskAnswers, setRiskAnswers, riskScore, riskProfile, holdings } =
  useNexmove();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<number[]>(riskAnswers);
  const [step, setStep] = useState(0);
  const [taking, setTaking] = useState(riskAnswers.length === 0);

  const exposure = equityExposure(holdings);
  const target = suggestedAllocation[riskProfile];
  const current = riskQuestions[step];

  const choose = (index: number) => {
    const next = [...answers];
    next[step] = index;
    setAnswers(next);
    if (step === riskQuestions.length - 1) {
      setRiskAnswers(next);
      setTaking(false);
      toast.success('Risk profile updated');
      return;
    }
    window.setTimeout(() => setStep((s) => s + 1), 120);
  };

  if (taking) {
    const progress = (step + 1) / riskQuestions.length * 100;
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader
          title="Risk Profiler"
          subtitle="Eight short questions. There are no right answers — only your honest comfort level." />
        
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
            <span>Question {step + 1} of {riskQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
            <motion.div className="h-full rounded-full bg-brand-500" animate={{ width: `${progress}%` }} transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }} />
          </div>
        </div>
        <Card className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
              
              <h2 className="text-xl font-bold text-ink">{current.question}</h2>
              <p className="mt-1.5 text-sm text-muted">{current.helper}</p>
              <div className="mt-5 grid gap-2.5">
                {current.options.map((o, i) =>
                <button
                  key={o.label}
                  type="button"
                  onClick={() => choose(i)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors duration-150 ease-out ${
                  answers[step] === i ?
                  'border-brand-500 bg-brand-50 text-brand-700 dark:bg-navy-800' :
                  'border-line bg-surface text-ink hover:border-brand-400'}`
                  }>
                  
                    {o.label}
                  </button>
                )}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                  <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" /> Back
                </Button>
                {riskAnswers.length > 0 &&
                <Button variant="secondary" onClick={() => setTaking(false)}>
                    Cancel
                  </Button>
                }
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>
        <Disclaimer />
      </div>);

  }

  const meterPos = Math.max(4, Math.min(96, riskScore));

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader
        title="Risk Profile"
        subtitle="What your answers mean, and how your portfolio compares."
        action={
        <Button variant="secondary" onClick={() => {setStep(0);setTaking(true);}}>
            <RefreshCwIcon className="h-4 w-4" aria-hidden="true" /> Retake profiler
          </Button>
        } />
      

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <ProgressRing value={riskScore} label="Risk score" sublabel={riskProfile} color="#1463ff" />
            <div>
              <h2 className="text-lg font-bold text-ink">You are a {riskProfile} investor</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {riskExplanations[riskProfile]}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                This score is built from your investing experience, how long you
                can stay invested, how you would react to a fall, income
                stability, obligations, objective, loss tolerance and emergency
                savings — not from any single answer.
              </p>
            </div>
          </div>

          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Risk meter</p>
            <div className="relative mt-3 h-3 w-full rounded-full bg-line">
              <div className="absolute inset-0 flex overflow-hidden rounded-full">
                <span className="h-full flex-1 bg-emeraldx-400" />
                <span className="h-full flex-1 bg-cyanx-400" />
                <span className="h-full flex-1 bg-brand-400" />
                <span className="h-full flex-1 bg-attention-500" />
                <span className="h-full flex-1 bg-danger-500" />
              </div>
              <span
                className="absolute -top-1 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-white bg-navy-900 shadow-lift"
                style={{ left: `${meterPos}%` }}
                aria-hidden="true" />
              
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-medium text-muted">
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          <Card className="p-5">
            <h3 className="text-base font-semibold text-ink">Suggested allocation</h3>
            <p className="mt-1 text-sm text-muted">A starting reference for a {riskProfile.toLowerCase()} profile.</p>
            <ul className="mt-3 space-y-2.5">
              {[
              ['Equity', target.equity, exposure.equityPct],
              ['Debt', target.debt, exposure.debtPct],
              ['Gold / other', target.gold, exposure.otherPct]].
              map(([label, targetPct, actualPct]) =>
              <li key={label as string}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink">{label}</span>
                    <span className="nx-num text-muted">
                      {(actualPct as number).toFixed(0)}% now · {targetPct}% target
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.min(100, actualPct as number)}%` }} />
                  </div>
                </li>
              )}
            </ul>
          </Card>

          <Card className="p-5">
            <Badge tone={Math.abs(exposure.equityPct - target.equity) > 15 ? 'attention' : 'positive'}>
              {Math.abs(exposure.equityPct - target.equity) > 15 ? 'Allocation drift' : 'Aligned'}
            </Badge>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {exposure.equityPct > target.equity + 15 ?
              `Your equity share is ${exposure.equityPct.toFixed(0)}%, above the ${target.equity}% reference for your profile. Consider directing new money to debt or gold rather than selling in a hurry.` :
              exposure.equityPct < target.equity - 15 ?
              `Your equity share is ${exposure.equityPct.toFixed(0)}%, below the ${target.equity}% reference. If your horizon is long, gradually increasing equity may suit your goals.` :
              'Your current mix broadly matches your risk profile. Review again after any large addition or withdrawal.'}
            </p>
            <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={() => navigate('/what-if')}>
              Test an allocation change
            </Button>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader title="Why you got this score" subtitle="Your answer to each factor" />
        <ul className="divide-y divide-line">
          {riskQuestions.map((q, i) =>
          <li key={q.id} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-muted">{q.question}</span>
              <span className="text-sm font-semibold text-ink">
                {q.options[answers[i] ?? 0]?.label ?? '—'}
              </span>
            </li>
          )}
        </ul>
      </Card>

      <Disclaimer />
    </div>);

}