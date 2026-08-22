import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Disclaimer, PageHeader } from '../components/ui/Bits';
import { useNexmove } from '../contexts/NexmoveContext';
import { formatINR } from '../utils/format';

const COLORS = ['#1463ff', '#08b9d6', '#12a875', '#e89b29', '#4f8bff', '#0c855c', '#93a4c4', '#d94b42', '#2ecbe4'];

export function Spending() {
  const { spend, monthly, profile } = useNexmove();
  const navigate = useNavigate();
  const total = spend.reduce((s, e) => s + e.amount, 0);
  const savings = profile.monthlyIncome - total;
  const rate = profile.monthlyIncome ? savings / profile.monthlyIncome * 100 : 0;
  const sorted = [...spend].sort((a, b) => b.amount - a.amount);

  const unusual = spend.
  map((e) => ({
    ...e,
    drift:
    e.previousAmount > 0 ?
    (e.amount - e.previousAmount) / e.previousAmount * 100 :
    0
  })).
  filter((e) => Math.abs(e.drift) >= 15).
  sort((a, b) => Math.abs(b.drift) - Math.abs(a.drift));

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader
        title="Spend Analysis"
        subtitle="See where your money actually goes, and which category quietly grew." />
      

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
        ['Monthly income', formatINR(profile.monthlyIncome)],
        ['Monthly spending', formatINR(total)],
        ['Monthly savings', formatINR(savings)],
        ['Savings rate', `${rate.toFixed(1)}%`]].
        map(([label, value]) =>
        <Card key={label} className="p-4">
            <p className="text-xs text-muted">{label}</p>
            <p className="nx-num mt-1 text-lg font-bold text-ink">{value}</p>
          </Card>
        )}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Category breakdown" subtitle="This month vs last month" />
          <div className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sorted} margin={{ left: 4, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--nx-border)" />
                <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} interval={0} angle={-16} textAnchor="end" height={56} />
                <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}K`} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} />
                <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: 12, border: '1px solid var(--nx-border)', background: 'var(--nx-surface)', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="previousAmount" name="Last month" fill="var(--nx-border)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="amount" name="This month" radius={[6, 6, 0, 0]}>
                  {sorted.map((e, i) =>
                  <Cell key={e.category} fill={COLORS[i % COLORS.length]} />
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Unusual spending" subtitle="Categories that moved most" />
          <ul className="divide-y divide-line">
            {unusual.length === 0 &&
            <li className="px-5 py-6 text-sm text-muted">
                Nothing unusual this month — every category stayed close to its
                normal range.
              </li>
            }
            {unusual.map((u) =>
            <li key={u.category} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">{u.category}</span>
                  <span
                  className={`inline-flex items-center gap-1 text-sm font-semibold ${
                  u.drift > 0 ? 'text-attention-600' : 'text-emeraldx-600'}`
                  }>
                  
                    {u.drift > 0 ?
                  <TrendingUpIcon className="h-3.5 w-3.5" aria-hidden="true" /> :

                  <TrendingDownIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  }
                    {u.drift > 0 ? '+' : ''}
                    {u.drift.toFixed(0)}%
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {u.drift > 0 ?
                `You spent ${formatINR(u.amount - u.previousAmount)} more than usual on ${u.category.toLowerCase()} this month.` :
                `${u.category} dropped by ${formatINR(u.previousAmount - u.amount)} compared with last month.`}
                </p>
              </li>
            )}
          </ul>
          <div className="border-t border-line p-4">
            <Button variant="secondary" size="sm" className="w-full" onClick={() => navigate('/budget')}>
              Adjust my budget
            </Button>
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Six-month trend" subtitle="Income, spending and what you actually kept" />
        <div className="h-72 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthly} margin={{ left: 4, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--nx-border)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} />
              <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}K`} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} />
              <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: 12, border: '1px solid var(--nx-border)', background: 'var(--nx-surface)', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="income" name="Income" stroke="#93a4c4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="spend" name="Spending" stroke="#e89b29" strokeWidth={2.4} dot={false} />
              <Line type="monotone" dataKey="savings" name="Savings" stroke="#12a875" strokeWidth={2.4} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Disclaimer />
    </div>);

}