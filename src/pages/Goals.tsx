import React, { useState } from 'react';
import { toast } from 'sonner';
import { PlusIcon, TargetIcon, Trash2Icon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Badge,
  Disclaimer,
  EmptyState,
  Field,
  PageHeader,
  SliderRow,
  inputClass } from
'../components/ui/Bits';
import { useNexmove } from '../contexts/NexmoveContext';
import { formatINR } from '../utils/format';
import { goalProgress } from '../utils/finance';

const presets = [
'Buy a laptop',
'Higher education',
'Emergency fund',
'Car',
'House',
'Marriage',
'Vacation',
'Retirement',
'Custom goal'];


export function Goals() {
  const { goals, addGoal, updateGoal, removeGoal } = useNexmove();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: presets[0],
    custom: '',
    targetAmount: '',
    savedAmount: '',
    monthlyContribution: '',
    targetDate: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low'
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name === 'Custom goal' ? form.custom.trim() : form.name;
    if (!name) return setError('Name your goal.');
    if (Number(form.targetAmount) <= 0) return setError('Enter a target amount.');
    if (!form.targetDate) return setError('Choose a target date.');
    if (new Date(form.targetDate) <= new Date())
    return setError('The target date must be in the future.');
    setError('');
    addGoal({
      name,
      icon: 'target',
      targetAmount: Number(form.targetAmount),
      savedAmount: Number(form.savedAmount) || 0,
      monthlyContribution: Number(form.monthlyContribution) || 0,
      targetDate: form.targetDate,
      priority: form.priority
    });
    toast.success(`${name} added to your goals`);
    setForm({ name: presets[0], custom: '', targetAmount: '', savedAmount: '', monthlyContribution: '', targetDate: '', priority: 'Medium' });
    setOpen(false);
  };

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader
        title="Financial Goals"
        subtitle="Turn each goal into a monthly number you can actually act on."
        action={
        <Button onClick={() => setOpen((v) => !v)}>
            <PlusIcon className="h-4 w-4" aria-hidden="true" /> New goal
          </Button>
        } />
      

      {open &&
      <Card className="mb-4 p-5">
          <h2 className="text-base font-semibold text-ink">Create a goal</h2>
          <form onSubmit={submit} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Goal" htmlFor="g-name">
              <select id="g-name" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}>
                {presets.map((p) =>
              <option key={p} value={p}>{p}</option>
              )}
              </select>
            </Field>
            {form.name === 'Custom goal' &&
          <Field label="Custom name" htmlFor="g-custom">
                <input id="g-custom" className={inputClass} value={form.custom} onChange={(e) => setForm({ ...form, custom: e.target.value })} placeholder="Bike upgrade" />
              </Field>
          }
            <Field label="Target amount" htmlFor="g-target">
              <input id="g-target" type="number" min={0} className={inputClass} value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} placeholder="80000" />
            </Field>
            <Field label="Already saved" htmlFor="g-saved">
              <input id="g-saved" type="number" min={0} className={inputClass} value={form.savedAmount} onChange={(e) => setForm({ ...form, savedAmount: e.target.value })} placeholder="35000" />
            </Field>
            <Field label="Monthly contribution" htmlFor="g-monthly">
              <input id="g-monthly" type="number" min={0} className={inputClass} value={form.monthlyContribution} onChange={(e) => setForm({ ...form, monthlyContribution: e.target.value })} placeholder="5000" />
            </Field>
            <Field label="Target date" htmlFor="g-date">
              <input id="g-date" type="date" className={inputClass} value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
            </Field>
            <Field label="Priority" htmlFor="g-priority">
              <select id="g-priority" className={inputClass} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as 'High' | 'Medium' | 'Low' })}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </Field>
            {error &&
          <p role="alert" className="rounded-xl bg-danger-100 px-3 py-2 text-sm font-medium text-danger-600 sm:col-span-2 lg:col-span-3">
                {error}
              </p>
          }
            <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
              <Button type="submit">Save goal</Button>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      }

      {goals.length === 0 ?
      <EmptyState
        icon={<TargetIcon className="h-5 w-5" />}
        title="No goals yet"
        body="A goal converts a vague wish into a monthly amount. Start with an emergency fund or the nearest purchase you are planning."
        action={<Button onClick={() => setOpen(true)}>Create your first goal</Button>} /> :


      <div className="grid gap-4 lg:grid-cols-2">
          {goals.map((goal) => {
          const gp = goalProgress(goal);
          const onTrack = gp.shortfallMonthly <= 0;
          return (
            <Card key={goal.id}>
                <CardHeader
                title={goal.name}
                subtitle={`Target ${formatINR(goal.targetAmount)} · ${gp.months} months remaining`}
                action={<Badge tone={goal.priority === 'High' ? 'attention' : 'info'}>{goal.priority}</Badge>} />
              
                <div className="p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="nx-num text-2xl font-bold text-ink">{gp.pct.toFixed(2)}%</p>
                      <p className="text-xs text-muted">
                        {formatINR(goal.savedAmount)} saved of {formatINR(goal.targetAmount)}
                      </p>
                    </div>
                    <Badge tone={onTrack ? 'positive' : 'attention'}>
                      {onTrack ? 'On track' : 'Needs a top-up'}
                    </Badge>
                  </div>
                  <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-brand-500 transition-[width] duration-200 ease-out" style={{ width: `${gp.pct}%` }} />
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    {[
                  ['Required monthly', formatINR(gp.required)],
                  ['Current monthly', formatINR(goal.monthlyContribution)],
                  ['Projected value', formatINR(gp.projected)],
                  ['Time remaining', `${gp.months} months`]].
                  map(([k, v]) =>
                  <div key={k} className="rounded-xl border border-line bg-canvas px-3 py-2">
                        <dt className="text-xs text-muted">{k}</dt>
                        <dd className="nx-num mt-0.5 font-semibold text-ink">{v}</dd>
                      </div>
                  )}
                  </dl>

                  <div className="mt-4">
                    <SliderRow
                    label="Adjust monthly contribution"
                    value={goal.monthlyContribution}
                    min={0}
                    max={Math.max(20000, Math.round(gp.required * 2))}
                    step={250}
                    display={formatINR(goal.monthlyContribution)}
                    onChange={(v) => updateGoal(goal.id, { monthlyContribution: v })} />
                  
                  </div>

                  <p className="mt-4 rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm leading-relaxed text-muted">
                    {onTrack ?
                  `At ${formatINR(goal.monthlyContribution)}/month this goal is comfortably funded, assuming a 9% annual return.` :
                  `Increase your monthly saving by ${formatINR(gp.shortfallMonthly)} to reach this goal comfortably, assuming a 9% annual return.`}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <Button
                    size="sm"
                    onClick={() => {
                      updateGoal(goal.id, { monthlyContribution: Math.round(gp.required) });
                      toast.success(`Contribution set to ${formatINR(gp.required)}/month`);
                    }}>
                    
                      Match required amount
                    </Button>
                    <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      removeGoal(goal.id);
                      toast.success(`${goal.name} removed`);
                    }}>
                    
                      <Trash2Icon className="h-3.5 w-3.5" aria-hidden="true" /> Remove
                    </Button>
                  </div>
                </div>
              </Card>);

        })}
        </div>
      }

      <Disclaimer />
    </div>);

}