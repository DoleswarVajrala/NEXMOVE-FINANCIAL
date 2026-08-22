import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  SparklesIcon } from
'lucide-react';
import { Logo } from '../components/layout/Logo';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Disclaimer, inputClass } from '../components/ui/Bits';
import { useNexmove } from '../contexts/NexmoveContext';
import type { Persona, UserProfile } from '../types/finance';
import { emptyProfile } from '../data/demo';
import { formatINR } from '../utils/format';
import {
  healthComponents,
  healthLabel,
  healthScore,
  savingsRate } from
'../utils/finance';

type StepId =
'name' |
'age' |
'persona' |
'income' |
'expenses' |
'savings' |
'investments' |
'experience' |
'horizon' |
'goals' |
'risk' |
'emergency';

const goalOptions = [
'Emergency fund',
'Higher education',
'Buy a laptop',
'Car',
'House',
'Marriage',
'Vacation',
'Retirement'];


export function Onboarding() {
  const { completeOnboarding, startDemo } = useNexmove();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState<UserProfile>({ ...emptyProfile });

  const steps: {id: StepId;prompt: string;helper: string;}[] = [
  { id: 'name', prompt: 'Hi! What should we call you?', helper: 'We use your name to personalise insights.' },
  { id: 'age', prompt: `Nice to meet you${draft.name ? `, ${draft.name.split(' ')[0]}` : ''}. How old are you?`, helper: 'Age helps us judge your investing horizon.' },
  { id: 'persona', prompt: 'Which describes you best right now?', helper: 'This changes how we explain things to you.' },
  { id: 'income', prompt: 'What is your monthly income?', helper: 'Include salary, stipend, freelance or pocket money.' },
  { id: 'expenses', prompt: 'Roughly how much do you spend each month?', helper: 'A close estimate is fine — you can refine it later.' },
  { id: 'savings', prompt: 'How much have you saved so far?', helper: 'Bank balance, cash and liquid savings.' },
  { id: 'investments', prompt: 'What is the current value of your investments?', helper: 'Enter 0 if you have not started yet — that is perfectly normal.' },
  { id: 'experience', prompt: 'How would you describe your investing experience?', helper: 'There is no wrong answer here.' },
  { id: 'horizon', prompt: 'How long do you plan to stay invested?', helper: 'Longer horizons allow more time to recover from falls.' },
  { id: 'goals', prompt: 'What are you working towards?', helper: 'Pick as many as apply.' },
  { id: 'risk', prompt: 'How do you feel about market ups and downs?', helper: 'We refine this later in the full risk profiler.' },
  { id: 'emergency', prompt: 'How many months of expenses do you keep as emergency savings?', helper: 'Most guidance suggests three to six months.' }];


  const current = steps[step];
  const progress = (step + 1) / steps.length * 100;

  const profileSummary = useMemo(() => {
    const components = healthComponents({
      profile: draft,
      holdings: [],
      goals: [],
      budget: {
        income: draft.monthlyIncome,
        needs: draft.monthlyExpenses * 0.65,
        wants: draft.monthlyExpenses * 0.35,
        savings: 0,
        investments: 0
      },
      spend: []
    });
    return {
      score: healthScore(components),
      components,
      rate: savingsRate(draft)
    };
  }, [draft]);

  const validate = (): boolean => {
    switch (current.id) {
      case 'name':
        if (draft.name.trim().length < 2) {
          setError('Please enter your name.');
          return false;
        }
        break;
      case 'age':
        if (draft.age < 14 || draft.age > 90) {
          setError('Enter an age between 14 and 90.');
          return false;
        }
        break;
      case 'income':
        if (draft.monthlyIncome <= 0) {
          setError('Enter your monthly income.');
          return false;
        }
        break;
      case 'expenses':
        if (draft.monthlyExpenses <= 0) {
          setError('Enter your monthly expenses.');
          return false;
        }
        if (draft.monthlyExpenses > draft.monthlyIncome) {
          setError('Expenses are higher than income — check the number before continuing.');
          return false;
        }
        break;
      case 'goals':
        if (draft.goalTags.length === 0) {
          setError('Choose at least one goal.');
          return false;
        }
        break;
      default:
        break;
    }
    setError('');
    return true;
  };

  const next = () => {
    if (!validate()) return;
    if (step === steps.length - 1) {
      completeOnboarding(draft);
      setDone(true);
      return;
    }
    setStep((s) => s + 1);
  };

  const numberInput = (
  value: number,
  onChange: (v: number) => void,
  placeholder: string) =>

  <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">
        ₹
      </span>
      <input
      type="number"
      inputMode="numeric"
      min={0}
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder={placeholder}
      className={`${inputClass} pl-7 text-lg`}
      autoFocus />
    
    </div>;


  const choice = (
  options: {label: string;value: string;hint?: string;}[],
  selected: string,
  onSelect: (value: string) => void) =>

  <div className="grid gap-2.5 sm:grid-cols-2">
      {options.map((o) =>
    <button
      key={o.value}
      type="button"
      onClick={() => onSelect(o.value)}
      className={`rounded-xl border px-4 py-3 text-left transition-colors duration-150 ease-out ${
      selected === o.value ?
      'border-brand-500 bg-brand-50 dark:bg-navy-800' :
      'border-line bg-surface hover:border-brand-400'}`
      }>
      
          <span className="block text-sm font-semibold text-ink">{o.label}</span>
          {o.hint && <span className="mt-0.5 block text-xs text-muted">{o.hint}</span>}
        </button>
    )}
    </div>;


  if (done) {
    return (
      <div className="min-h-screen w-full bg-canvas px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Logo />
          <Card className="mt-6 p-6 sm:p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emeraldx-100 px-3 py-1 text-xs font-semibold text-emeraldx-600">
              <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" /> Profile ready
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">
              Your NEXMOVE Financial Profile
            </h1>
            <p className="mt-2 text-sm text-muted">
              This is a preliminary picture based on what you shared. It updates
              as you add investments, goals and spending.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
              <ProgressRing
                value={profileSummary.score}
                label="Health score"
                sublabel={healthLabel(profileSummary.score)}
                color="#12a875" />
              
              <dl className="grid gap-3 sm:grid-cols-2">
                {[
                ['Savings rate', `${profileSummary.rate.toFixed(1)}%`],
                ['Monthly surplus', formatINR(draft.monthlyIncome - draft.monthlyExpenses)],
                ['Risk comfort', draft.riskComfort],
                ['Investment readiness', draft.monthlyIncome - draft.monthlyExpenses > 2000 ? 'Ready to start' : 'Build savings first'],
                ['Emergency fund', `${draft.emergencyFundMonths.toFixed(1)} of 6 months`],
                ['Goal readiness', draft.goalTags.length > 0 ? `${draft.goalTags.length} goals defined` : 'No goals yet']].
                map(([label, value]) =>
                <div key={label} className="rounded-xl border border-line bg-canvas px-3 py-2.5">
                    <dt className="text-xs text-muted">{label}</dt>
                    <dd className="nx-num mt-0.5 text-sm font-semibold text-ink">{value}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => navigate('/risk')}>
                Continue to risk profile
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/dashboard')}>
                Go to dashboard
              </Button>
            </div>
            <Disclaimer />
          </Card>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen w-full bg-canvas px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <Logo />
          <Link to="/" className="text-sm font-medium text-muted hover:text-ink">
            Exit
          </Link>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
            <span>
              Step {step + 1} of {steps.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full rounded-full bg-brand-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }} />
            
          </div>
        </div>

        <Card className="mt-5 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
              
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                NEXMOVE
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">
                {current.prompt}
              </h1>
              <p className="mt-1.5 text-sm text-muted">{current.helper}</p>

              <div className="mt-6">
                {current.id === 'name' &&
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Your name"
                  className={`${inputClass} text-lg`}
                  autoFocus />

                }
                {current.id === 'age' &&
                <input
                  type="number"
                  value={draft.age || ''}
                  min={14}
                  max={90}
                  onChange={(e) => setDraft({ ...draft, age: Number(e.target.value) })}
                  className={`${inputClass} text-lg`}
                  autoFocus />

                }
                {current.id === 'persona' &&
                choice(
                  [
                  { label: 'Student', value: 'student', hint: 'Limited income, starting out' },
                  { label: 'Professional', value: 'professional', hint: 'Salary, multiple platforms' },
                  { label: 'First-time investor', value: 'first-time', hint: 'New to stocks and funds' }],

                  draft.persona,
                  (v) => setDraft({ ...draft, persona: v as Persona })
                )}
                {current.id === 'income' &&
                numberInput(draft.monthlyIncome, (v) => setDraft({ ...draft, monthlyIncome: v }), '45000')}
                {current.id === 'expenses' &&
                numberInput(draft.monthlyExpenses, (v) => setDraft({ ...draft, monthlyExpenses: v }), '28000')}
                {current.id === 'savings' &&
                numberInput(draft.currentSavings, (v) => setDraft({ ...draft, currentSavings: v }), '100000')}
                {current.id === 'investments' &&
                numberInput(draft.existingInvestments, (v) => setDraft({ ...draft, existingInvestments: v }), '0')}
                {current.id === 'experience' &&
                choice(
                  [
                  { label: 'None', value: 'None', hint: 'Never invested' },
                  { label: 'Beginner', value: 'Beginner', hint: 'One or two SIPs' },
                  { label: 'Some', value: 'Some', hint: 'A few years of investing' },
                  { label: 'Experienced', value: 'Experienced', hint: 'Track markets actively' }],

                  draft.experience,
                  (v) => setDraft({ ...draft, experience: v as UserProfile['experience'] })
                )}
                {current.id === 'horizon' &&
                choice(
                  [
                  { label: 'Under 2 years', value: '2' },
                  { label: '2–5 years', value: '5' },
                  { label: '5–10 years', value: '10' },
                  { label: '10+ years', value: '15' }],

                  String(draft.horizonYears),
                  (v) => setDraft({ ...draft, horizonYears: Number(v) })
                )}
                {current.id === 'goals' &&
                <div className="flex flex-wrap gap-2">
                    {goalOptions.map((g) => {
                    const active = draft.goalTags.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() =>
                        setDraft({
                          ...draft,
                          goalTags: active ?
                          draft.goalTags.filter((t) => t !== g) :
                          [...draft.goalTags, g]
                        })
                        }
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors duration-150 ease-out ${
                        active ?
                        'border-brand-500 bg-brand-500 text-white' :
                        'border-line bg-surface text-ink hover:border-brand-400'}`
                        }
                        aria-pressed={active}>
                        
                          {active && <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />}
                          {g}
                        </button>);

                  })}
                  </div>
                }
                {current.id === 'risk' &&
                choice(
                  [
                  { label: 'They worry me', value: 'Low', hint: 'I prefer stability' },
                  { label: 'I can handle some', value: 'Medium', hint: 'Moderate swings are fine' },
                  { label: 'I am comfortable', value: 'High', hint: 'I accept large swings' }],

                  draft.riskComfort,
                  (v) => setDraft({ ...draft, riskComfort: v as UserProfile['riskComfort'] })
                )}
                {current.id === 'emergency' &&
                choice(
                  [
                  { label: 'None yet', value: '0' },
                  { label: '1–2 months', value: '1.5' },
                  { label: '3–5 months', value: '4' },
                  { label: '6+ months', value: '6' }],

                  String(draft.emergencyFundMonths),
                  (v) => setDraft({ ...draft, emergencyFundMonths: Number(v) })
                )}
              </div>

              {error &&
              <p role="alert" className="mt-4 rounded-xl bg-danger-100 px-3 py-2 text-sm font-medium text-danger-600">
                  {error}
                </p>
              }

              <div className="mt-7 flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}>
                  
                  <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" /> Back
                </Button>
                <Button onClick={next}>
                  {step === steps.length - 1 ? 'See my profile' : 'Continue'}
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>

        <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">In a hurry to explore?</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              startDemo();
              toast.success('Demo account loaded');
              navigate('/dashboard');
            }}>
            
            Try Demo Account instead
          </Button>
        </div>
        <Disclaimer />
      </div>
    </div>);

}