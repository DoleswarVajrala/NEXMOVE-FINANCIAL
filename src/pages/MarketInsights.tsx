import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { InfoIcon, MessageSquareWarningIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge, Disclaimer, PageHeader } from '../components/ui/Bits';
import { Button } from '../components/ui/Button';
import { useNexmove } from '../contexts/NexmoveContext';
import { formatPercent } from '../utils/format';
import { hypeVsData, indexTrend, indices, marketNews, sectors } from '../data/market';

export function MarketInsights() {
  const { riskProfile } = useNexmove();
  const [showData, setShowData] = useState(false);

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader
        title="Market Insights"
        subtitle="Context and data for your decisions — never a call to buy or sell." />
      

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {indices.map((ix) =>
        <Card key={ix.name} className="p-4">
            <p className="text-xs text-muted">{ix.name}</p>
            <p className="nx-num mt-1 text-lg font-bold text-ink">
              {ix.value.toLocaleString('en-IN')}
            </p>
            <p className={`text-xs font-semibold ${ix.change >= 0 ? 'text-emeraldx-600' : 'text-danger-500'}`}>
              {formatPercent(ix.change)} today
            </p>
          </Card>
        )}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="NIFTY 50 this week" subtitle="Short-term movement is noise; direction over years is what matters" />
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={indexTrend} margin={{ left: 4, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--nx-border)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} />
                <YAxis domain={['dataMin - 200', 'dataMax + 200']} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--nx-border)', background: 'var(--nx-surface)', fontSize: 12 }} />
                <Line type="monotone" dataKey="nifty" name="NIFTY 50" stroke="#1463ff" strokeWidth={2.6} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-base font-semibold text-ink">Volatility check</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Market volatility has increased this week. Based on your{' '}
            <strong className="text-ink">{riskProfile}</strong> risk profile, this
            is a good moment to review whether your asset allocation still
            matches your comfort level — not a signal to act quickly.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            {[
            ['India VIX', '14.8 · Moderate'],
            ['30-day range', '±3.2%'],
            ['News sentiment', 'Mixed']].
            map(([k, v]) =>
            <div key={k} className="flex items-center justify-between rounded-xl border border-line bg-canvas px-3 py-2">
                <span className="text-muted">{k}</span>
                <span className="font-semibold text-ink">{v}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Sector performance" subtitle="Relative movement over the last month" />
        <div className="h-64 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectors} margin={{ left: 4, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--nx-border)" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} />
              <YAxis tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 12, border: '1px solid var(--nx-border)', background: 'var(--nx-surface)', fontSize: 12 }} />
              <Bar dataKey="change" radius={[6, 6, 0, 0]}>
                {sectors.map((s) =>
                <Cell key={s.name} fill={s.change >= 0 ? '#12a875' : '#d94b42'} />
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <section className="mt-6">
        <h2 className="text-xl font-bold tracking-tight text-ink">Hype vs Data</h2>
        <p className="mt-1 text-sm text-muted">
          Before following a trending tip, compare the claim with what the numbers show.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <MessageSquareWarningIcon className="h-4 w-4 text-attention-600" aria-hidden="true" />
              <h3 className="text-base font-semibold text-ink">Social media says</h3>
            </div>
            <p className="mt-3 rounded-xl border border-line bg-canvas px-4 py-4 text-lg font-semibold leading-snug text-ink">
              {hypeVsData.claim}
            </p>
            <p className="mt-3 text-sm text-muted">
              Popularity spreads faster than analysis. Screenshots rarely show
              valuation, debt or how long the run-up took.
            </p>
            {!showData &&
            <Button className="mt-4" onClick={() => setShowData(true)}>
                Show the NEXMOVE data view
              </Button>
            }
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-ink">NEXMOVE data view</h3>
              <Badge tone="info">{hypeVsData.ticker}</Badge>
            </div>
            {showData ?
            <>
                <dl className="mt-4 grid gap-2 sm:grid-cols-2">
                  {hypeVsData.metrics.map((m) =>
                <div key={m.label} className="rounded-xl border border-line bg-canvas px-3 py-2.5">
                      <dt className="text-xs text-muted">{m.label}</dt>
                      <dd className="nx-num mt-0.5 text-sm font-bold text-ink">{m.value}</dd>
                      <p className="mt-0.5 text-xs text-muted">{m.context}</p>
                    </div>
                )}
                </dl>
                <p className="mt-4 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm leading-relaxed text-ink dark:border-navy-600 dark:bg-navy-800">
                  {hypeVsData.verdict}
                </p>
              </> :

            <p className="mt-4 flex items-start gap-2 rounded-xl border border-dashed border-line px-4 py-8 text-sm text-muted">
                <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Reveal the data view to compare the claim against valuation,
                history, volatility, fundamentals and risk.
              </p>
            }
          </Card>
        </div>
      </section>

      <Card className="mt-4">
        <CardHeader title="Explained news" subtitle="What each headline actually means for a beginner" />
        <ul className="divide-y divide-line">
          {marketNews.map((n) =>
          <li key={n.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-ink">{n.headline}</h3>
                <Badge tone={n.sentiment === 'Positive' ? 'positive' : n.sentiment === 'Caution' ? 'attention' : 'info'}>
                  {n.sentiment}
                </Badge>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{n.summary}</p>
            </li>
          )}
        </ul>
      </Card>

      <Disclaimer />
    </div>);

}