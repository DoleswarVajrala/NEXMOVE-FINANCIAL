import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { ArrowUpRightIcon, SparklesIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressRing } from '../ui/ProgressRing';
import { portfolioTrend } from '../../data/demo';
import { formatINR } from '../../utils/format';

const cards = [
{ label: 'Portfolio value', value: '₹4,85,000', change: '+15.48%' },
{ label: 'Monthly SIP', value: '₹7,000', change: '2 active plans' },
{ label: 'Savings rate', value: '37.8%', change: 'Above target' }];


export function DashboardPreview() {
  const reduce = useReducedMotion();

  return (
    <Card className="overflow-hidden p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Live preview
          </p>
          <p className="text-sm font-semibold text-ink">Good evening, Aarav 👋</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emeraldx-100 px-2.5 py-1 text-[11px] font-semibold text-emeraldx-600">
          <SparklesIcon className="h-3 w-3" aria-hidden="true" /> Demo data
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-4 rounded-2xl border border-line bg-canvas p-4">
          <ProgressRing value={78} size={104} stroke={10} label="Health" color="#12a875" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">Financial Health</p>
            <p className="text-xs text-muted">Good · Balanced investor</p>
            <p className="mt-2 text-xs text-muted">
              Strong savings rate, emergency fund at 70%.
            </p>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-1">
          {cards.map((c, i) =>
          <motion.div
            key={c.label}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.24,
              delay: 0.08 + i * 0.05,
              ease: [0.23, 1, 0.32, 1]
            }}
            className="flex items-center justify-between rounded-xl border border-line bg-canvas px-3 py-2.5">
            
              <span className="text-xs text-muted">{c.label}</span>
              <span className="flex items-center gap-2">
                <span className="nx-num text-sm font-bold text-ink">{c.value}</span>
                <span className="text-[11px] font-semibold text-emeraldx-600">
                  {c.change}
                </span>
              </span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-line bg-canvas p-3">
        <div className="flex items-center justify-between px-1 pb-2">
          <p className="text-xs font-semibold text-ink">Portfolio growth</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emeraldx-600">
            <ArrowUpRightIcon className="h-3 w-3" aria-hidden="true" /> ₹65,000 gain
          </span>
        </div>
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={portfolioTrend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="previewFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1463ff" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#1463ff" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} />
              
              <YAxis hide domain={['dataMin - 20000', 'dataMax + 10000']} />
              <Tooltip
                formatter={(v: number) => formatINR(v)}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid var(--nx-border)',
                  background: 'var(--nx-surface)',
                  fontSize: 12
                }} />
              
              <Area
                type="monotone"
                dataKey="value"
                stroke="#1463ff"
                strokeWidth={2.4}
                fill="url(#previewFill)" />
              
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-line bg-canvas px-3 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
          Today’s next move
        </p>
        <p className="mt-1 text-sm text-ink">
          🟢 Your emergency fund is 70% complete — ₹2,500/month closes the gap.
        </p>
      </div>
    </Card>);

}