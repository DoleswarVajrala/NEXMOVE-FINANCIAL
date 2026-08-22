import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Bar,
  BarChart,
  XAxis,
  YAxis } from
'recharts';
import { PieChartIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button, ButtonLink } from '../components/ui/Button';
import {
  Badge,
  Disclaimer,
  EmptyState,
  Field,
  PageHeader,
  inputClass } from
'../components/ui/Bits';
import { useNexmove } from '../contexts/NexmoveContext';
import { formatINR, formatPercent } from '../utils/format';
import {
  allocationBySector,
  allocationByType,
  equityExposure } from
'../utils/finance';
import type { AssetType } from '../types/finance';

const COLORS = ['#1463ff', '#08b9d6', '#12a875', '#e89b29', '#4f8bff', '#0c855c', '#93a4c4', '#d94b42'];
const assetTypes: AssetType[] = [
'Stocks',
'Mutual Funds',
'SIP',
'ETF',
'Fixed Deposit',
'Gold',
'Savings',
'Other'];


export function Portfolio() {
  const { holdings, totals, addHolding, removeHolding, diversification, riskProfile } =
  useNexmove();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'Stocks' as AssetType,
    sector: 'Diversified',
    invested: '',
    current: '',
    monthlySip: ''
  });
  const [error, setError] = useState('');

  const byType = allocationByType(holdings);
  const bySector = allocationBySector(holdings);
  const exposure = equityExposure(holdings);
  const topSector = bySector[0];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Give the holding a name.');
    if (Number(form.invested) <= 0) return setError('Enter the invested amount.');
    if (Number(form.current) <= 0) return setError('Enter the current value.');
    setError('');
    addHolding({
      name: form.name.trim(),
      type: form.type,
      sector: form.sector.trim() || 'Diversified',
      invested: Number(form.invested),
      current: Number(form.current),
      monthlySip: form.monthlySip ? Number(form.monthlySip) : undefined
    });
    toast.success(`${form.name} added to your portfolio`);
    setForm({ name: '', type: 'Stocks', sector: 'Diversified', invested: '', current: '', monthlySip: '' });
    setOpen(false);
  };

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader
        title="My Portfolio"
        subtitle="Every investment across platforms, consolidated into one honest view."
        action={
        <Button onClick={() => setOpen((v) => !v)}>
            <PlusIcon className="h-4 w-4" aria-hidden="true" /> Add investment
          </Button>
        } />
      

      {open &&
      <Card className="mb-4 p-5">
          <h2 className="text-base font-semibold text-ink">Add a holding</h2>
          <form onSubmit={submit} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Name" htmlFor="h-name">
              <input id="h-name" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Axis Bluechip Fund" />
            </Field>
            <Field label="Type" htmlFor="h-type">
              <select id="h-type" className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AssetType })}>
                {assetTypes.map((t) =>
              <option key={t} value={t}>{t}</option>
              )}
              </select>
            </Field>
            <Field label="Sector" htmlFor="h-sector">
              <input id="h-sector" className={inputClass} value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} placeholder="Technology" />
            </Field>
            <Field label="Invested amount" htmlFor="h-inv">
              <input id="h-inv" type="number" min={0} className={inputClass} value={form.invested} onChange={(e) => setForm({ ...form, invested: e.target.value })} placeholder="50000" />
            </Field>
            <Field label="Current value" htmlFor="h-cur">
              <input id="h-cur" type="number" min={0} className={inputClass} value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} placeholder="56000" />
            </Field>
            <Field label="Monthly SIP (optional)" htmlFor="h-sip">
              <input id="h-sip" type="number" min={0} className={inputClass} value={form.monthlySip} onChange={(e) => setForm({ ...form, monthlySip: e.target.value })} placeholder="3000" />
            </Field>
            {error &&
          <p role="alert" className="sm:col-span-2 lg:col-span-3 rounded-xl bg-danger-100 px-3 py-2 text-sm font-medium text-danger-600">
                {error}
              </p>
          }
            <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
              <Button type="submit">Save holding</Button>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      }

      {holdings.length === 0 ?
      <EmptyState
        icon={<PieChartIcon className="h-5 w-5" />}
        title="No investments added yet"
        body="Add your stocks, funds, SIPs, FDs or gold to see consolidated returns, allocation and risk exposure."
        action={<Button onClick={() => setOpen(true)}>Add your first investment</Button>} /> :


      <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
          ['Total portfolio', formatINR(totals.current)],
          ['Invested', formatINR(totals.invested)],
          ['Gain', formatINR(totals.gain)],
          ['Overall return', formatPercent(totals.returnPct)],
          ['XIRR (approx.)', formatPercent(totals.xirr)]].
          map(([label, value]) =>
          <Card key={label} className="p-4">
                <p className="text-xs text-muted">{label}</p>
                <p className="nx-num mt-1 text-lg font-bold text-ink">{value}</p>
              </Card>
          )}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader title="Holdings" subtitle={`${holdings.length} investments across ${byType.length} asset types`} />
              <div className="nx-scroll overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                      <th scope="col" className="px-5 py-3 font-semibold">Investment</th>
                      <th scope="col" className="px-3 py-3 font-semibold">Type</th>
                      <th scope="col" className="px-3 py-3 text-right font-semibold">Invested</th>
                      <th scope="col" className="px-3 py-3 text-right font-semibold">Current</th>
                      <th scope="col" className="px-3 py-3 text-right font-semibold">Return</th>
                      <th scope="col" className="px-5 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {holdings.map((h) => {
                    const ret = (h.current - h.invested) / h.invested * 100;
                    return (
                      <tr key={h.id}>
                          <td className="px-5 py-3">
                            <span className="block font-medium text-ink">{h.name}</span>
                            <span className="text-xs text-muted">{h.sector}</span>
                          </td>
                          <td className="px-3 py-3 text-muted">{h.type}</td>
                          <td className="nx-num px-3 py-3 text-right text-ink">{formatINR(h.invested)}</td>
                          <td className="nx-num px-3 py-3 text-right text-ink">{formatINR(h.current)}</td>
                          <td className={`nx-num px-3 py-3 text-right font-semibold ${ret >= 0 ? 'text-emeraldx-600' : 'text-danger-500'}`}>
                            {formatPercent(ret)}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button
                            type="button"
                            onClick={() => {
                              removeHolding(h.id);
                              toast.success(`${h.name} removed`);
                            }}
                            aria-label={`Remove ${h.name}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors duration-150 ease-out hover:text-danger-500">
                            
                              <Trash2Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </td>
                        </tr>);

                  })}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="grid gap-4">
              <Card className="p-5">
                <h3 className="text-base font-semibold text-ink">Asset allocation</h3>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={byType} dataKey="value" nameKey="name" innerRadius={40} outerRadius={66} paddingAngle={2}>
                        {byType.map((e, i) =>
                      <Cell key={e.name} fill={COLORS[i % COLORS.length]} />
                      )}
                      </Pie>
                      <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: 12, border: '1px solid var(--nx-border)', background: 'var(--nx-surface)', fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-1 space-y-1">
                  {byType.map((a, i) =>
                <li key={a.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-ink">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} aria-hidden="true" />
                        {a.name}
                      </span>
                      <span className="nx-num text-muted">{a.pct.toFixed(1)}%</span>
                    </li>
                )}
                </ul>
              </Card>

              <Card className="p-5">
                <h3 className="text-base font-semibold text-ink">Risk exposure</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  {[
                ['Equity exposure', `${exposure.equityPct.toFixed(0)}%`],
                ['Debt exposure', `${exposure.debtPct.toFixed(0)}%`],
                ['Other (gold, cash)', `${exposure.otherPct.toFixed(0)}%`],
                ['Diversification score', `${diversification}/100`],
                ['Largest sector', topSector ? `${topSector.name} · ${topSector.pct.toFixed(0)}%` : '—']].
                map(([k, v]) =>
                <div key={k} className="flex items-center justify-between">
                      <dt className="text-muted">{k}</dt>
                      <dd className="nx-num font-semibold text-ink">{v}</dd>
                    </div>
                )}
                </dl>
                <div className="mt-4 rounded-xl border border-line bg-canvas p-3">
                  <Badge tone={diversification >= 70 ? 'positive' : 'attention'}>
                    {diversification >= 70 ? 'Well spread' : 'Concentration risk'}
                  </Badge>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {topSector && topSector.pct > 25 ?
                  `${topSector.name} is ${topSector.pct.toFixed(0)}% of your portfolio. As a ${riskProfile.toLowerCase()} investor, spreading new investments across other sectors reduces how much one industry decides your outcome.` :
                  'Your holdings are reasonably spread across sectors. Keep reviewing after every large addition.'}
                  </p>
                </div>
                <ButtonLink to="/what-if" variant="secondary" size="sm" className="mt-3 w-full">
                  Simulate a change
                </ButtonLink>
              </Card>
            </div>
          </div>

          <Card className="mt-4">
            <CardHeader title="Sector allocation" subtitle="Where your equity risk actually sits" />
            <div className="h-64 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bySector} margin={{ left: 4, right: 12 }}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} interval={0} angle={-12} textAnchor="end" height={54} />
                  <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}K`} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} />
                  <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: 12, border: '1px solid var(--nx-border)', background: 'var(--nx-surface)', fontSize: 12 }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {bySector.map((e, i) =>
                  <Cell key={e.name} fill={COLORS[i % COLORS.length]} />
                  )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      }

      <Disclaimer />
    </div>);

}