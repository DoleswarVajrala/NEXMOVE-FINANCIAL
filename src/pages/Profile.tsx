import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckIcon, LogOutIcon, RefreshCwIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Badge, Disclaimer, PageHeader } from '../components/ui/Bits';
import { useNexmove } from '../contexts/NexmoveContext';
import { formatINR } from '../utils/format';
import { healthLabel } from '../utils/finance';

const personaLabel: Record<string, string> = {
  student: 'Student',
  professional: 'Professional',
  'first-time': 'First-time investor'
};

export function Profile() {
  const {
    profile,
    health,
    riskProfile,
    riskScore,
    nextMoves,
    completeMove,
    resetDemo,
    signOut,
    theme,
    toggleTheme,
    demoMode,
    savingsRatePct
  } = useNexmove();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader
        title="Profile & Action Center"
        subtitle="Your financial identity, your score breakdown, and every recommended next move." />
      

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <ProgressRing
              value={health.score}
              label="Health score"
              sublabel={healthLabel(health.score)}
              color={health.score >= 70 ? '#12a875' : '#e89b29'} />
            
            <div>
              <h2 className="text-lg font-bold text-ink">
                {profile.name || 'Your profile'}
              </h2>
              <p className="text-sm text-muted">
                {personaLabel[profile.persona]} · {profile.age} years ·{' '}
                {profile.email || 'demo@nexmove.in'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="info">{riskProfile} · {riskScore}/100</Badge>
                <Badge tone="positive">Savings rate {savingsRatePct.toFixed(0)}%</Badge>
                {demoMode && <Badge tone="attention">Demo data</Badge>}
              </div>
            </div>
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
            ['Monthly income', formatINR(profile.monthlyIncome)],
            ['Monthly expenses', formatINR(profile.monthlyExpenses)],
            ['Current savings', formatINR(profile.currentSavings)],
            ['Investment horizon', `${profile.horizonYears} years`],
            ['Experience', profile.experience],
            ['Emergency cover', `${profile.emergencyFundMonths.toFixed(1)} months`]].
            map(([k, v]) =>
            <div key={k} className="rounded-xl border border-line bg-canvas px-3 py-2.5">
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="nx-num mt-0.5 text-sm font-semibold text-ink">{v}</dd>
              </div>
            )}
          </dl>
        </Card>

        <Card className="p-5">
          <h3 className="text-base font-semibold text-ink">Improve your score</h3>
          <p className="mt-1 text-sm text-muted">
            The components pulling your score down the most.
          </p>
          <ul className="mt-4 space-y-3">
            {[...health.components].
            sort((a, b) => a.score - b.score).
            slice(0, 3).
            map((c) =>
            <li key={c.key}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{c.label}</span>
                    <span className="nx-num text-muted">{c.score}/100</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-attention-500" style={{ width: `${c.score}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted">{c.note}</p>
                </li>
            )}
          </ul>
          <div className="mt-5 space-y-2">
            <Button variant="secondary" size="sm" className="w-full" onClick={toggleTheme}>
              Switch to {theme === 'light' ? 'dark' : 'light'} theme
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => {
                resetDemo();
                toast.success('Demo data reset');
                navigate('/');
              }}>
              
              <RefreshCwIcon className="h-3.5 w-3.5" aria-hidden="true" /> Reset demo data
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => {
                signOut();
                navigate('/');
              }}>
              
              <LogOutIcon className="h-3.5 w-3.5" aria-hidden="true" /> Sign out
            </Button>
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader
          title="My Next Moves"
          subtitle="Prioritized actions with the reason and estimated impact behind each" />
        
        <ul className="divide-y divide-line">
          {nextMoves.map((m) =>
          <li key={m.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className={m.done ? 'opacity-60' : ''}>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={m.priority === 'High' ? 'attention' : m.priority === 'Medium' ? 'info' : 'neutral'}>
                    {m.priority} priority
                  </Badge>
                  <h3 className="text-sm font-semibold text-ink">{m.title}</h3>
                  {m.done &&
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emeraldx-600">
                      <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" /> Done
                    </span>
                }
                </div>
                <p className="mt-1 text-sm text-muted">{m.reason}</p>
                <p className="mt-0.5 text-xs font-medium text-emeraldx-600">
                  Estimated impact: {m.impact}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" onClick={() => navigate(m.path)}>
                  {m.actionLabel}
                </Button>
                {!m.done &&
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  completeMove(m.id);
                  toast.success('Marked as done');
                }}>
                
                    Done
                  </Button>
              }
              </div>
            </li>
          )}
        </ul>
      </Card>

      <Disclaimer />
    </div>);

}