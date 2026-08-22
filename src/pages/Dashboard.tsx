import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BrainCircuitIcon,
  RocketIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  WalletIcon } from
'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button, ButtonLink } from '../components/ui/Button';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { Badge, Disclaimer, EmptyState, Skeleton } from '../components/ui/Bits';
import { HealthPanel } from '../components/dashboard/HealthPanel';
import { InsightFeed } from '../components/dashboard/InsightFeed';
import { useNexmove } from '../contexts/NexmoveContext';
import { formatINR, formatPercent } from '../utils/format';
import { allocationByType, goalProgress } from '../utils/finance';
import { portfolioTrend } from '../data/demo';
import { indices } from '../data/market';

const PIE_COLORS = ['#1463ff', '#08b9d6', '#12a875', '#e89b29', '#4f8bff', '#0c855c', '#93a4c4', '#d94b42'];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function Dashboard() {
  const {
    profile,
    holdings,
    goals,
    spend,
    totals,
    health,
    insights,
    nextMoves,
    riskScore,
    riskProfile,
    onboarded,
    demoMode,
    startDemo
  } = useNexmove();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(t);
  }, []);

  const netWorth = totals.current + profile.currentSavings;
  const monthlySavings = profile.monthlyIncome - profile.monthlyExpenses;
  const allocation = allocationByType(holdings);
  const spendChart = [...spend].sort((a, b) => b.amount - a.amount).slice(0, 6);
  const topMoves = nextMoves.filter((m) => !m.done).slice(0, 3);

  if (!onboarded) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          icon={<RocketIcon className="h-5 w-5" />}
          title="Your dashboard is waiting for your profile"
          body="Complete the short conversational setup, or load the demo account to explore NEXMOVE with realistic Indian financial data."
          action={
          <div className="flex flex-col gap-2 sm:flex-row">
              <ButtonLink to="/onboarding">Build my financial plan</ButtonLink>
              <Button
              variant="secondary"
              onClick={() => {
                startDemo();
                navigate('/dashboard');
              }}>
              
                Try Demo Account
              </Button>
            </div>
          } />
        
      </div>);

  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) =>
          <Skeleton key={i} className="h-28 w-full" />
          )}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>);

  }

  const stats = [
  {
    label: 'Net worth',
    value: netWorth,
    format: (v: number) => formatINR(v),
    sub: 'Investments + savings',
    icon: WalletIcon,
    path: '/portfolio'
  },
  {
    label: 'Portfolio value',
    value: totals.current,
    format: (v: number) => formatINR(v),
    sub: `${formatPercent(totals.returnPct)} overall return`,
    icon: TrendingUpIcon,
    path: '/portfolio'
  },
  {
    label: 'Monthly savings',
    value: monthlySavings,
    format: (v: number) => formatINR(v),
    sub: `${(monthlySavings / (profile.monthlyIncome || 1) * 100).toFixed(0)}% savings rate`,
    icon: ArrowUpRightIcon,
    path: '/budget'
  },
  {
    label: 'Risk score',
    value: riskScore,
    format: (v: number) => `${Math.round(v)}/100`,
    sub: riskScore ? `${riskProfile} investor` : 'Not assessed yet',
    icon: ShieldCheckIcon,
    path: '/risk'
  }];


  return (
    <div className="mx-auto max-w-[1180px]">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[28px]">
            {greeting()}, {profile.name.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="mt-1 text-sm text-muted">
            Here is what changed in your money this week.
            {demoMode && ' You are viewing the demo account.'}
          </p>
        </div>
        <ButtonLink to="/nex-ai" variant="secondary">
          <BrainCircuitIcon className="h-4 w-4" aria-hidden="true" /> Ask NEX AI
        </ButtonLink>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HealthPanel
            score={health.score}
            components={health.components}
            riskProfile={riskScore ? riskProfile : 'Not assessed'} />
          
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {stats.map((s) =>
          <Link
            key={s.label}
            to={s.path}
            className="rounded-2xl border border-line bg-surface/90 p-4 shadow-card transition-[border-color,transform] duration-150 ease-out hover:border-brand-400">
            
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">{s.label}</span>
                <s.icon className="h-4 w-4 text-brand-500" aria-hidden="true" />
              </div>
              <AnimatedNumber
              value={s.value}
              format={s.format}
              className="mt-1.5 block text-xl font-bold text-ink" />
            
              <p className="mt-0.5 text-xs text-muted">{s.sub}</p>
            </Link>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InsightFeed insights={insights} />
        </div>

        <Card>
          <CardHeader title="Goal progress" subtitle="Your active plans" />
          <ul className="space-y-4 p-5">
            {goals.slice(0, 3).map((g) => {
              const gp = goalProgress(g);
              return (
                <li key={g.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{g.name}</span>
                    <span className="nx-num text-muted">{gp.pct.toFixed(0)}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${gp.pct}%` }} />
                    
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {formatINR(g.savedAmount)} of {formatINR(g.targetAmount)} ·{' '}
                    {gp.months} months left
                  </p>
                </li>);

            })}
          </ul>
          <div className="border-t border-line px-5 py-3">
            <Link to="/goals" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
              Manage goals <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Portfolio overview"
            subtitle={`Invested ${formatINR(totals.invested)} · Current ${formatINR(totals.current)}`}
            action={
            <Badge tone={totals.gain >= 0 ? 'positive' : 'danger'}>
                {formatPercent(totals.returnPct)}
              </Badge>
            } />
          
          <div className="grid gap-4 p-5 sm:grid-cols-[1.4fr_1fr]">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioTrend}>
                  <defs>
                    <linearGradient id="dashFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#12a875" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#12a875" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} />
                  <YAxis hide domain={['dataMin - 30000', 'dataMax + 15000']} />
                  <Tooltip
                    formatter={(v: number, n) => [formatINR(v), n === 'value' ? 'Current value' : 'Invested']}
                    contentStyle={{ borderRadius: 12, border: '1px solid var(--nx-border)', background: 'var(--nx-surface)', fontSize: 12 }} />
                  
                  <Area type="monotone" dataKey="invested" stroke="#93a4c4" strokeWidth={1.6} fill="none" strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="value" stroke="#12a875" strokeWidth={2.4} fill="url(#dashFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Asset allocation
              </p>
              <ul className="mt-2 space-y-1.5">
                {allocation.slice(0, 5).map((a, i) =>
                <li key={a.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-ink">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} aria-hidden="true" />
                      {a.name}
                    </span>
                    <span className="nx-num text-muted">{a.pct.toFixed(0)}%</span>
                  </li>
                )}
              </ul>
              <Link to="/portfolio" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                Full portfolio <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Spending this month" subtitle={`${formatINR(spend.reduce((s, e) => s + e.amount, 0))} across ${spend.length} categories`} />
          <div className="h-52 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendChart} layout="vertical" margin={{ left: 8, right: 12 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" width={78} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} />
                <Tooltip
                  formatter={(v: number) => formatINR(v)}
                  contentStyle={{ borderRadius: 12, border: '1px solid var(--nx-border)', background: 'var(--nx-surface)', fontSize: 12 }} />
                
                <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                  {spendChart.map((entry, i) =>
                  <Cell key={entry.category} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border-t border-line px-5 py-3">
            <Link to="/spending" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
              Analyse spending <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="My Next Moves" subtitle="Prioritized, with the reason behind each one" />
          <ul className="divide-y divide-line">
            {topMoves.map((m) =>
            <li key={m.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge tone={m.priority === 'High' ? 'attention' : 'info'}>{m.priority}</Badge>
                    <p className="text-sm font-semibold text-ink">{m.title}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted">{m.reason}</p>
                  <p className="mt-0.5 text-xs font-medium text-emeraldx-600">{m.impact}</p>
                </div>
                <Button size="sm" variant="secondary" className="shrink-0 self-start sm:self-center" onClick={() => navigate(m.path)}>
                  {m.actionLabel}
                </Button>
              </li>
            )}
          </ul>
          <div className="border-t border-line px-5 py-3">
            <Link to="/profile" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
              See all recommended actions <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader title="Market snapshot" subtitle="Context, not calls to action" />
            <ul className="divide-y divide-line">
              {indices.slice(0, 3).map((ix) =>
              <li key={ix.name} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm font-medium text-ink">{ix.name}</span>
                  <span className="text-right">
                    <span className="nx-num block text-sm font-semibold text-ink">
                      {ix.value.toLocaleString('en-IN')}
                    </span>
                    <span className={`text-xs font-semibold ${ix.change >= 0 ? 'text-emeraldx-600' : 'text-danger-500'}`}>
                      {formatPercent(ix.change)}
                    </span>
                  </span>
                </li>
              )}
            </ul>
            <div className="border-t border-line px-5 py-3">
              <Link to="/market" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                Hype vs Data <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <BrainCircuitIcon className="h-4 w-4 text-brand-500" aria-hidden="true" />
              <h3 className="text-base font-semibold text-ink">NEX AI insight</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Your savings rate of{' '}
              {(monthlySavings / (profile.monthlyIncome || 1) * 100).toFixed(0)}% is
              healthy. The bigger lever right now is spreading your equity across
              more than one sector before adding new money.
            </p>
            <ButtonLink to="/nex-ai" variant="ghost" size="sm" className="mt-3 px-0">
              Ask a follow-up <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </Card>

          <Card className="p-5">
            <h3 className="text-base font-semibold text-ink">Allocation mix</h3>
            <div className="mt-2 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={allocation} dataKey="value" nameKey="name" innerRadius={38} outerRadius={62} paddingAngle={2}>
                    {allocation.map((entry, i) =>
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => formatINR(v)}
                    contentStyle={{ borderRadius: 12, border: '1px solid var(--nx-border)', background: 'var(--nx-surface)', fontSize: 12 }} />
                  
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      <Disclaimer />
    </div>);

}