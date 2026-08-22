import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { Card, CardHeader } from '../components/ui/Card';
import { Disclaimer, PageHeader, SliderRow } from '../components/ui/Bits';
import { formatINR } from '../utils/format';
import {
  compoundValue,
  emiFor,
  futureValueOfSip,
  requiredMonthlyForGoal } from
'../utils/finance';

type CalcId = 'sip' | 'goal' | 'emergency' | 'compound' | 'retirement' | 'loan';

const tabs: {id: CalcId;label: string;}[] = [
{ id: 'sip', label: 'SIP' },
{ id: 'goal', label: 'Goal' },
{ id: 'emergency', label: 'Emergency fund' },
{ id: 'compound', label: 'Compound interest' },
{ id: 'retirement', label: 'Retirement' },
{ id: 'loan', label: 'Loan / EMI' }];


function Result({ items }: {items: [string, string][];}) {
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {items.map(([k, v]) =>
      <div key={k} className="rounded-xl border border-line bg-canvas px-3 py-2.5">
          <dt className="text-xs text-muted">{k}</dt>
          <dd className="nx-num mt-0.5 text-lg font-bold text-ink">{v}</dd>
        </div>
      )}
    </dl>);

}

function Chart({ data }: {data: {name: string;invested: number;value: number;}[];}) {
  return (
    <div className="mt-5 h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 4, right: 12 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--nx-border)" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} />
          <YAxis tickFormatter={(v) => `${Math.round(v / 100000)}L`} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--nx-muted)' }} />
          <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: 12, border: '1px solid var(--nx-border)', background: 'var(--nx-surface)', fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="invested" name="Invested" fill="#93a4c4" radius={[6, 6, 0, 0]} />
          <Bar dataKey="value" name="Projected value" fill="#1463ff" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>);

}

export function Calculators() {
  const [tab, setTab] = useState<CalcId>('sip');

  const [sip, setSip] = useState({ monthly: 5000, rate: 12, years: 10 });
  const [goal, setGoal] = useState({ target: 800000, saved: 100000, years: 5, rate: 9 });
  const [ef, setEf] = useState({ expenses: 28000, months: 6, saved: 120000 });
  const [ci, setCi] = useState({ principal: 100000, rate: 8, years: 10 });
  const [ret, setRet] = useState({ age: 27, retireAt: 60, monthly: 8000, rate: 11 });
  const [loan, setLoan] = useState({ amount: 800000, rate: 9.5, years: 5 });

  const sipResult = useMemo(() => {
    const fv = futureValueOfSip(sip.monthly, sip.rate, sip.years);
    const invested = sip.monthly * 12 * sip.years;
    return { fv, invested, gain: fv - invested };
  }, [sip]);

  const goalResult = useMemo(() => {
    const months = goal.years * 12;
    const required = requiredMonthlyForGoal(goal.target, goal.saved, goal.rate, months);
    return { required, months };
  }, [goal]);

  const retResult = useMemo(() => {
    const years = Math.max(0, ret.retireAt - ret.age);
    const fv = futureValueOfSip(ret.monthly, ret.rate, years);
    return { years, fv, invested: ret.monthly * 12 * years };
  }, [ret]);

  const loanResult = useMemo(() => {
    const emi = emiFor(loan.amount, loan.rate, loan.years);
    const total = emi * loan.years * 12;
    return { emi, total, interest: total - loan.amount };
  }, [loan]);

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader
        title="Financial Simulators"
        subtitle="Run the numbers before you commit to a decision." />
      

      <div className="nx-scroll mb-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Calculators">
        {tabs.map((t) =>
        <button
          key={t.id}
          role="tab"
          aria-selected={tab === t.id}
          onClick={() => setTab(t.id)}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 ease-out ${
          tab === t.id ?
          'border-brand-500 bg-brand-500 text-white' :
          'border-line bg-surface text-ink hover:border-brand-400'}`
          }>
          
            {t.label}
          </button>
        )}
      </div>

      <Card>
        {tab === 'sip' &&
        <>
            <CardHeader title="SIP Calculator" subtitle="What a monthly investment could become" />
            <div className="grid gap-6 p-5 lg:grid-cols-2">
              <div className="space-y-5">
                <SliderRow label="Monthly investment" value={sip.monthly} min={500} max={100000} step={500} display={formatINR(sip.monthly)} onChange={(v) => setSip({ ...sip, monthly: v })} />
                <SliderRow label="Expected annual return" value={sip.rate} min={4} max={18} display={`${sip.rate}%`} onChange={(v) => setSip({ ...sip, rate: v })} />
                <SliderRow label="Duration" value={sip.years} min={1} max={35} display={`${sip.years} yrs`} onChange={(v) => setSip({ ...sip, years: v })} />
              </div>
              <div>
                <Result
                items={[
                ['Invested amount', formatINR(sipResult.invested)],
                ['Estimated returns', formatINR(sipResult.gain)],
                ['Future value', formatINR(sipResult.fv)]]
                } />
              
                <Chart
                data={[1, 3, 5, 10, 15, 20].
                filter((y) => y <= sip.years || y === 1).
                map((y) => ({
                  name: `Y${y}`,
                  invested: sip.monthly * 12 * y,
                  value: Math.round(futureValueOfSip(sip.monthly, sip.rate, y))
                }))} />
              
              </div>
            </div>
          </>
        }

        {tab === 'goal' &&
        <>
            <CardHeader title="Goal Calculator" subtitle="The monthly amount your goal actually needs" />
            <div className="grid gap-6 p-5 lg:grid-cols-2">
              <div className="space-y-5">
                <SliderRow label="Target amount" value={goal.target} min={10000} max={5000000} step={10000} display={formatINR(goal.target)} onChange={(v) => setGoal({ ...goal, target: v })} />
                <SliderRow label="Already saved" value={goal.saved} min={0} max={goal.target} step={5000} display={formatINR(goal.saved)} onChange={(v) => setGoal({ ...goal, saved: v })} />
                <SliderRow label="Years to goal" value={goal.years} min={1} max={30} display={`${goal.years} yrs`} onChange={(v) => setGoal({ ...goal, years: v })} />
                <SliderRow label="Expected return" value={goal.rate} min={4} max={16} display={`${goal.rate}%`} onChange={(v) => setGoal({ ...goal, rate: v })} />
              </div>
              <div>
                <Result
                items={[
                ['Required monthly', formatINR(goalResult.required)],
                ['Months remaining', `${goalResult.months}`],
                ['Gap to close', formatINR(Math.max(0, goal.target - goal.saved))]]
                } />
              
                <p className="mt-4 rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm leading-relaxed text-muted">
                  Investing {formatINR(goalResult.required)} every month for{' '}
                  {goal.years} years at an assumed {goal.rate}% should reach{' '}
                  {formatINR(goal.target)}. If markets underperform, extending the
                  timeline is usually safer than raising risk.
                </p>
              </div>
            </div>
          </>
        }

        {tab === 'emergency' &&
        <>
            <CardHeader title="Emergency Fund Calculator" subtitle="The cushion that protects everything else" />
            <div className="grid gap-6 p-5 lg:grid-cols-2">
              <div className="space-y-5">
                <SliderRow label="Monthly essential expenses" value={ef.expenses} min={5000} max={200000} step={1000} display={formatINR(ef.expenses)} onChange={(v) => setEf({ ...ef, expenses: v })} />
                <SliderRow label="Months of cover" value={ef.months} min={3} max={12} display={`${ef.months} months`} onChange={(v) => setEf({ ...ef, months: v })} />
                <SliderRow label="Already saved" value={ef.saved} min={0} max={1000000} step={5000} display={formatINR(ef.saved)} onChange={(v) => setEf({ ...ef, saved: v })} />
              </div>
              <div>
                <Result
                items={[
                ['Target fund', formatINR(ef.expenses * ef.months)],
                ['Still needed', formatINR(Math.max(0, ef.expenses * ef.months - ef.saved))],
                ['Coverage now', `${(ef.saved / (ef.expenses || 1)).toFixed(1)} months`]]
                } />
              
                <p className="mt-4 rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm leading-relaxed text-muted">
                  Keep this in a savings account or liquid fund — accessibility
                  matters more than returns for this money.
                </p>
              </div>
            </div>
          </>
        }

        {tab === 'compound' &&
        <>
            <CardHeader title="Compound Interest Calculator" subtitle="What a lump sum becomes over time" />
            <div className="grid gap-6 p-5 lg:grid-cols-2">
              <div className="space-y-5">
                <SliderRow label="Principal" value={ci.principal} min={5000} max={5000000} step={5000} display={formatINR(ci.principal)} onChange={(v) => setCi({ ...ci, principal: v })} />
                <SliderRow label="Annual rate" value={ci.rate} min={2} max={18} display={`${ci.rate}%`} onChange={(v) => setCi({ ...ci, rate: v })} />
                <SliderRow label="Years" value={ci.years} min={1} max={35} display={`${ci.years} yrs`} onChange={(v) => setCi({ ...ci, years: v })} />
              </div>
              <div>
                <Result
                items={[
                ['Principal', formatINR(ci.principal)],
                ['Interest earned', formatINR(compoundValue(ci.principal, ci.rate, ci.years) - ci.principal)],
                ['Final value', formatINR(compoundValue(ci.principal, ci.rate, ci.years))]]
                } />
              
                <Chart
                data={[1, 5, 10, 15, 20, 25].
                filter((y) => y <= ci.years || y === 1).
                map((y) => ({
                  name: `Y${y}`,
                  invested: ci.principal,
                  value: Math.round(compoundValue(ci.principal, ci.rate, y))
                }))} />
              
              </div>
            </div>
          </>
        }

        {tab === 'retirement' &&
        <>
            <CardHeader title="Retirement Calculator" subtitle="What steady investing until retirement could build" />
            <div className="grid gap-6 p-5 lg:grid-cols-2">
              <div className="space-y-5">
                <SliderRow label="Current age" value={ret.age} min={18} max={59} display={`${ret.age} yrs`} onChange={(v) => setRet({ ...ret, age: v })} />
                <SliderRow label="Retirement age" value={ret.retireAt} min={ret.age + 1} max={70} display={`${ret.retireAt} yrs`} onChange={(v) => setRet({ ...ret, retireAt: v })} />
                <SliderRow label="Monthly investment" value={ret.monthly} min={1000} max={100000} step={500} display={formatINR(ret.monthly)} onChange={(v) => setRet({ ...ret, monthly: v })} />
                <SliderRow label="Expected return" value={ret.rate} min={5} max={16} display={`${ret.rate}%`} onChange={(v) => setRet({ ...ret, rate: v })} />
              </div>
              <div>
                <Result
                items={[
                ['Years to retirement', `${retResult.years}`],
                ['Total invested', formatINR(retResult.invested)],
                ['Projected corpus', formatINR(retResult.fv)]]
                } />
              
                <p className="mt-4 rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm leading-relaxed text-muted">
                  This projection ignores inflation. At 6% inflation,{' '}
                  {formatINR(retResult.fv)} in {retResult.years} years would buy
                  roughly {formatINR(retResult.fv / Math.pow(1.06, retResult.years))} of
                  today’s goods.
                </p>
              </div>
            </div>
          </>
        }

        {tab === 'loan' &&
        <>
            <CardHeader title="Loan / EMI Calculator" subtitle="What borrowing actually costs" />
            <div className="grid gap-6 p-5 lg:grid-cols-2">
              <div className="space-y-5">
                <SliderRow label="Loan amount" value={loan.amount} min={10000} max={10000000} step={10000} display={formatINR(loan.amount)} onChange={(v) => setLoan({ ...loan, amount: v })} />
                <SliderRow label="Interest rate" value={loan.rate} min={5} max={24} step={0.5} display={`${loan.rate}%`} onChange={(v) => setLoan({ ...loan, rate: v })} />
                <SliderRow label="Tenure" value={loan.years} min={1} max={30} display={`${loan.years} yrs`} onChange={(v) => setLoan({ ...loan, years: v })} />
              </div>
              <div>
                <Result
                items={[
                ['Monthly EMI', formatINR(loanResult.emi)],
                ['Total interest', formatINR(loanResult.interest)],
                ['Total repayment', formatINR(loanResult.total)]]
                } />
              
                <p className="mt-4 rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm leading-relaxed text-muted">
                  Interest of {formatINR(loanResult.interest)} is{' '}
                  {(loanResult.interest / loan.amount * 100).toFixed(0)}% of what
                  you borrow. Clearing high-interest debt usually beats investing
                  the same amount.
                </p>
              </div>
            </div>
          </>
        }
      </Card>

      <Disclaimer />
    </div>);

}