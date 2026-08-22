import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressRing } from '../ui/ProgressRing';
import { healthLabel } from '../../utils/finance';
import type { HealthComponent } from '../../types/finance';

export function HealthPanel({
  score,
  components,
  riskProfile




}: {score: number;components: HealthComponent[];riskProfile: string;}) {
  const strengths = [...components].sort((a, b) => b.score - a.score).slice(0, 2);
  const attention = [...components].sort((a, b) => a.score - b.score).slice(0, 2);
  const color = score >= 70 ? '#12a875' : score >= 50 ? '#e89b29' : '#d94b42';

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-5">
          <ProgressRing value={score} label="out of 100" sublabel={healthLabel(score)} color={color} />
          <div>
            <h2 className="text-lg font-bold text-ink">Financial Health</h2>
            <p className="mt-1 max-w-xs text-sm text-muted">
              One score across savings, safety net, investing, diversification,
              goals and spending control.
            </p>
            <p className="mt-2 text-sm font-semibold text-brand-600">
              Risk profile: {riskProfile}
            </p>
          </div>
        </div>

        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-emeraldx-100 bg-emeraldx-100/40 p-3.5 dark:border-navy-600 dark:bg-navy-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-emeraldx-600">
              Strengths
            </p>
            <ul className="mt-2 space-y-1.5">
              {strengths.map((c) =>
              <li key={c.key} className="text-sm text-ink">
                  {c.label} · {c.score}/100
                </li>
              )}
            </ul>
          </div>
          <div className="rounded-xl border border-attention-100 bg-attention-100/40 p-3.5 dark:border-navy-600 dark:bg-navy-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-attention-600">
              Needs attention
            </p>
            <ul className="mt-2 space-y-1.5">
              {attention.map((c) =>
              <li key={c.key} className="text-sm text-ink">
                  {c.label} · {c.score}/100
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-2 border-t border-line pt-5 sm:grid-cols-2 lg:grid-cols-4">
        {components.map((c) =>
        <div key={c.key}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-ink">{c.label}</span>
              <span className="nx-num text-muted">{c.score}</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
              className="h-full rounded-full"
              style={{
                width: `${c.score}%`,
                backgroundColor:
                c.score >= 70 ? '#12a875' : c.score >= 45 ? '#e89b29' : '#d94b42'
              }} />
            
            </div>
          </div>
        )}
      </div>

      <Link
        to="/profile"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
        
        Improve your score
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Card>);

}