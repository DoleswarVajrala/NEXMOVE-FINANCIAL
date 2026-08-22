import React from 'react';
import { toast } from 'sonner';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangleIcon, CheckCircle2Icon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Disclaimer, PageHeader, SliderRow } from '../components/ui/Bits';
import { useNexmove } from '../contexts/NexmoveContext';
import { formatINR } from '../utils/format';

const COLORS = ['#1463ff', '#08b9d6', '#12a875', '#e89b29'];

export function BudgetPage() {
  const { budget, updateBudget, spend } = useNexmove();
  const allocated = budget.needs + budget.wants + budget.savings + budget.investments;
  const remaining = budget.income - allocated;
  const actualSpend = spend.reduce((s, e) => s + e.amount, 0);
  const planSpend = budget.needs + budget.wants;
  const overspend = actualSpend - planSpend;

  const pieData = [
  { name: 'Needs', value: budget.needs },
  { name: 'Wants', value: budget.wants },
  { name: 'Savings', value: budget.savings },
  { name: 'Investments', value: budget.investments }];


  const applyRule = () => {
    updateBudget({
      needs: Math.round(budget.income * 0.5),
      wants: Math.round(budget.income * 0.3),
      savings: Math.round(budget.income * 0.1),
      investments: Math.round(budget.income * 0.1)
    });
    toast.success('Applied the 50 / 30 / 10 / 10 starting split');
  };

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader
        title="Smart Budgeting"
        subtitle="Decide where each rupee of income goes before the month spends it for you."
        action={
        <Button variant="secondary" onClick={applyRule}>
            Apply 50/30/10/10 split
          </Button>
        } />
      

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Monthly plan" subtitle="Adjust the sliders to rebalance your month" />
          <div className="space-y-5 p-5">
            <SliderRow
              label="Monthly income"
              value={budget.income}
              min={0}
              max={300000}
              step={1000}
              display={formatINR(budget.income)}
              onChange={(v) => updateBudget({ income: v })} />
            
            <SliderRow
              label="Needs (rent, bills, food, transport)"
              value={budget.needs}
              min={0}
              max={Math.max(10000, budget.income)}
              step={500}
              display={formatINR(budget.needs)}
              onChange={(v) => updateBudget({ needs: v })} />
            
            <SliderRow
              label="Wants (shopping, entertainment)"
              value={budget.wants}
              min={0}
              max={Math.max(10000, budget.income)}
              step={500}
              display={formatINR(budget.wants)}
              onChange={(v) => updateBudget({ wants: v })} />
            
            <SliderRow
              label="Savings target"
              value={budget.savings}
              min={0}
              max={Math.max(10000, budget.income)}
              step={500}
              display={formatINR(budget.savings)}
              onChange={(v) => updateBudget({ savings: v })} />
            
            <SliderRow
              label="Investment target"
              value={budget.investments}
              min={0}
              max={Math.max(10000, budget.income)}
              step={500}
              display={formatINR(budget.investments)}
              onChange={(v) => updateBudget({ investments: v })} />
            

            <div className="rounded-xl border border-line bg-canvas p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-ink">Allocated</span>
                <span className="nx-num text-muted">
                  {formatINR(allocated)} of {formatINR(budget.income)}
                </span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-line">
                {pieData.map((p, i) =>
                <div
                  key={p.name}
                  className="h-full"
                  style={{
                    width: `${budget.income ? p.value / budget.income * 100 : 0}%`,
                    background: COLORS[i]
                  }}
                  aria-hidden="true" />

                )}
              </div>
              <p
                className={`mt-3 flex items-start gap-2 text-sm ${
                remaining < 0 ? 'text-danger-500' : 'text-emeraldx-600'}`
                }>
                
                {remaining < 0 ?
                <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> :

                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                }
                {remaining < 0 ?
                `You have planned ${formatINR(Math.abs(remaining))} more than you earn. Reduce a category before the month starts.` :
                `${formatINR(remaining)} is still unallocated. Assign it to savings or investments so it does not drift into spending.`}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          <Card className="p-5">
            <h3 className="text-base font-semibold text-ink">Budget mix</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={42} outerRadius={70} paddingAngle={2}>
                    {pieData.map((e, i) =>
                    <Cell key={e.name} fill={COLORS[i]} />
                    )}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: 12, border: '1px solid var(--nx-border)', background: 'var(--nx-surface)', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-1.5">
              {pieData.map((p, i) =>
              <li key={p.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-ink">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} aria-hidden="true" />
                    {p.name}
                  </span>
                  <span className="nx-num text-muted">{formatINR(p.value)}</span>
                </li>
              )}
            </ul>
          </Card>

          <Card className="p-5">
            <h3 className="text-base font-semibold text-ink">Plan vs actual</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              You planned {formatINR(planSpend)} for needs and wants, and actually
              spent {formatINR(actualSpend)} this month.
            </p>
            <p
              className={`mt-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
              overspend > 0 ?
              'bg-attention-100 text-attention-600' :
              'bg-emeraldx-100 text-emeraldx-600'}`
              }>
              
              {overspend > 0 ?
              `You are ${formatINR(overspend)} over your spending plan. Either raise the budget honestly or trim one recurring category.` :
              `You are ${formatINR(Math.abs(overspend))} under your plan. Consider moving the difference into investments.`}
            </p>
          </Card>
        </div>
      </div>

      <Disclaimer />
    </div>);

}