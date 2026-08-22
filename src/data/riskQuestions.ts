export interface RiskQuestion {
  id: string;
  question: string;
  helper: string;
  options: {label: string;weight: number;}[];
}

export const riskQuestions: RiskQuestion[] = [
{
  id: 'experience',
  question: 'How much investing experience do you have?',
  helper: 'Experience affects how familiar market ups and downs feel.',
  options: [
  { label: 'None — I am just starting', weight: 1 },
  { label: 'I have a SIP or two', weight: 2 },
  { label: 'A few years across funds and stocks', weight: 3 },
  { label: 'I invest actively and track markets', weight: 4 }]

},
{
  id: 'duration',
  question: 'How long can you stay invested without touching the money?',
  helper: 'Longer horizons give investments more time to recover from falls.',
  options: [
  { label: 'Under 1 year', weight: 1 },
  { label: '1–3 years', weight: 2 },
  { label: '3–7 years', weight: 3 },
  { label: 'More than 7 years', weight: 4 }]

},
{
  id: 'crash',
  question: 'Your portfolio drops 20% in a month. What would you do?',
  helper: 'There is no wrong answer — this measures comfort, not knowledge.',
  options: [
  { label: 'Withdraw everything immediately', weight: 1 },
  { label: 'Pause my SIPs and wait', weight: 2 },
  { label: 'Continue investing as planned', weight: 3 },
  { label: 'Invest more while prices are lower', weight: 4 }]

},
{
  id: 'income',
  question: 'How stable is your monthly income?',
  helper: 'Stable income makes it easier to keep investing during downturns.',
  options: [
  { label: 'Irregular or seasonal', weight: 1 },
  { label: 'Mostly stable with some variation', weight: 2 },
  { label: 'Stable salary', weight: 3 },
  { label: 'Stable and growing, with a second source', weight: 4 }]

},
{
  id: 'obligations',
  question: 'How much of your income goes to loans and dependents?',
  helper: 'Higher obligations reduce the room to absorb losses.',
  options: [
  { label: 'More than half', weight: 1 },
  { label: 'About a third', weight: 2 },
  { label: 'A small share', weight: 3 },
  { label: 'Almost none', weight: 4 }]

},
{
  id: 'objective',
  question: 'What matters most for this money?',
  helper: 'Protecting capital and chasing growth pull in opposite directions.',
  options: [
  { label: 'Keeping it safe', weight: 1 },
  { label: 'Beating inflation modestly', weight: 2 },
  { label: 'Steady long-term growth', weight: 3 },
  { label: 'Maximum growth, accepting swings', weight: 4 }]

},
{
  id: 'loss',
  question: 'What temporary loss could you live with in a bad year?',
  helper: 'Temporary means on paper — not a realised loss.',
  options: [
  { label: 'Almost none', weight: 1 },
  { label: 'Up to 10%', weight: 2 },
  { label: 'Up to 20%', weight: 3 },
  { label: 'More than 25%', weight: 4 }]

},
{
  id: 'emergency',
  question: 'How many months of expenses do you keep as emergency savings?',
  helper: 'A cushion prevents you from selling investments at the wrong time.',
  options: [
  { label: 'None yet', weight: 1 },
  { label: '1–2 months', weight: 2 },
  { label: '3–5 months', weight: 3 },
  { label: '6 months or more', weight: 4 }]

}];


export const riskOptionWeights = riskQuestions.map((q) =>
q.options.map((o) => o.weight)
);

export const riskExplanations: Record<string, string> = {
  Conservative:
  'You are a Conservative investor. Stability matters more to you than growth, so a larger share of debt, fixed deposits and cash usually feels comfortable.',
  Moderate:
  'You are a Moderate investor. You accept small fluctuations for slightly better returns, and a debt-tilted mix generally suits you.',
  Balanced:
  'You are a Balanced Investor. You may be comfortable with moderate market fluctuations while prioritizing long-term growth.',
  Growth:
  'You are a Growth investor. You accept meaningful short-term swings in exchange for higher long-term growth potential.',
  Aggressive:
  'You are an Aggressive investor. You are comfortable with large swings, which also means larger falls are possible — diversification still matters.'
};

export const suggestedAllocation: Record<
  string,
  {equity: number;debt: number;gold: number;}> =
{
  Conservative: { equity: 25, debt: 65, gold: 10 },
  Moderate: { equity: 40, debt: 50, gold: 10 },
  Balanced: { equity: 60, debt: 30, gold: 10 },
  Growth: { equity: 75, debt: 18, gold: 7 },
  Aggressive: { equity: 85, debt: 10, gold: 5 }
};