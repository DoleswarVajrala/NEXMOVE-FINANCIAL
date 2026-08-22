import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { RotateCcwIcon, SparklesIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Disclaimer, PageHeader, SliderRow } from '../components/ui/Bits';
import { useNexmove } from '../contexts/NexmoveContext';
import { formatINR } from '../utils/format';
import { futureValueOfSip } from '../utils/finance';

const scenarios = [
{ id: 'sip', label: 'Invest ₹5,000 instead of ₹3,000' },
{ id: 'spend', label: 'Reduce shopping by ₹2,000' },
{ id: 'crash', label: 'Market falls 20%' },
{ id: 'early', label: 'Start investing 2 years earlier' }];


export function WhatIf() {
  const { totals } = useNexmove();
  const baseSip = Math.max(3000, totals.monthlySip);
  const [monthly, setMonthly] = useState(baseSip + 2000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const [shock, setShock] = useState(0);
  const [extraYears, setExtraYears] = useState(0);

  const data = useMemo(() => {
    const points: {
      year: string;
      baseline: number;
      adjusted: number;
      invested: number;
    }[] = [];
    for (let y = 0; y <= years; y++) {
      const baseline = futureValueOfSip(baseSip, rate, y);
      const adjustedYears = y + extraYears;
      let adjusted = futureValueOfSip(monthly, rate, adjustedYears);
      if (shock > 0) adjusted = adjusted * (1 - shock / 100);
      points.push({
        year: `Y${y}`,
        baseline: Math.round(baseline),
        adjusted: Math.round(adjusted),
        invested: Math.round(monthly * 12 * adjustedYears)
      });
    }
    return points;
  }, [monthly, years, rate, shock, extraYears, baseSip]);

  const final = data[data.length - 1];
  const difference = final.adjusted - final.baseline;

  const applyScenario = (id: string) => {
    if (id === 'sip') {
      setMonthly(5000);
      setShock(0);
      setExtraYears(0);
    }
    if (id === 'spend') {
      setMonthly(baseSip + 2000);
      setShock(0);
      setExtraYears(0);
    }
    if (id === 'crash') setShock(20);
    if (id === 'early') setExtraYears(2);
  };

  const reset = () => {
    setMonthly(baseSip + 2000);
    setYears(15);
    setRate(12);
    setShock(0);
    setExtraYears(0);
  };

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader
        title="NEXMOVE What-If"
        subtitle="Change one decision and see how it could reshape your long-term outcome."
        action={
        <Button variant="secondary" onClick={reset}>
            <RotateCcwIcon className="h-4 w-4" aria-hidden="true" /> Reset
          </Button>
        } />
      

      <div className="mb-4 flex flex-wrap gap-2">
        {scenarios.map((s) =>
        <button
          key={s.id}
          type="button"
          onClick={() => applyScenario(s.id)}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink transition-colors duration-150 ease-out hover:border-brand-400 hover:text-brand-600">
          
            <SparklesIcon className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
            What if I {s.label.toLowerCase()}?
          </button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <h2 className="text-base font-semibold text-ink">Your decision</h2>
          <div className="mt-5 space-y-5">
            <SliderRow label="Monthly investment" value={monthly} min={500} max={50000} step={500} display={formatINR(monthly)} onChange={setMonthly} />
            <SliderRow label="Years invested" value={years} min={1} max={35} display={`${years} yrs`} onChange={setYears} />
            <SliderRow label="Assumed annual return" value={rate} min={4} max={18} display={`${rate}%`} onChange={setRate} />
            <SliderRow label="Market shock applied" value={shock} min={0} max={40} step={5} display={`-${shock}%`} onChange={setShock} />
            <SliderRow label="Head start (years earlier)" value={extraYears} min={0} max={5} display={`${extraYears} yrs`} onChange={setExtraYears} />
          </div>
          <p className="mt-5 rounded-xl border border-line bg-canvas px-3 py-2.5 text-xs leading-relaxed text-muted">
            Baseline uses your current SIP of {formatINR(baseSip)}/month. Projections
            assume a constant return, which never happens in reality — actual
            outcomes will vary and can be negative in some years.
          </p>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Projected outcome"
            subtitle={`Baseline ${formatINR(baseSip)}/month vs your adjusted plan`} />
          
          <div className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ left: 4, right: 12 }}>
                <defs>
                  <linearGradient id="adjFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#12a875" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#12a875" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--nx-border)" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} />
                <YAxis tickFormatter={(v) => `${Math.round(v / 100000)}L`} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} />
                <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: 12, border: '1px solid var(--nx-border)', background: 'var(--nx-surface)', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="baseline" name="Current plan" stroke="#93a4c4" strokeWidth={2} fill="none" strokeDasharray="5 4" />
                <Area type="monotone" dataKey="adjusted" name="Adjusted plan" stroke="#12a875" strokeWidth={2.6} fill="url(#adjFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-3 border-t border-line p-5 sm:grid-cols-3">
            {[
            ['Adjusted value', formatINR(final.adjusted)],
            ['Current plan value', formatINR(final.baseline)],
            ['Difference', `${difference >= 0 ? '+' : ''}${formatINR(difference)}`]].
            map(([k, v]) =>
            <div key={k} className="rounded-xl border border-line bg-canvas px-3 py-2.5">
                <p className="text-xs text-muted">{k}</p>
                <p className="nx-num mt-0.5 text-lg font-bold text-ink">{v}</p>
              </div>
            )}
          </div>

          <p className="border-t border-line px-5 py-4 text-sm leading-relaxed text-muted">
            {shock > 0 ?
            `A ${shock}% market fall applied at the end of this period reduces the projected value, but the monthly investing itself continues to accumulate units. Falls hurt most when they force you to sell — which is exactly what an emergency fund prevents.` :
            difference > 0 ?
            `Investing ${formatINR(monthly)} instead of ${formatINR(baseSip)} could leave you roughly ${formatINR(difference)} better off in ${years} years at an assumed ${rate}% return. Most of that difference comes from time, not from timing.` :
            `This adjustment lowers the projected outcome versus your current plan of ${formatINR(baseSip)}/month. Increasing the monthly amount or the horizon has the biggest effect.`}
          </p>
        </Card>
      </div>

      <Disclaimer />
    </div>);

}