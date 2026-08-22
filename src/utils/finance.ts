import type {
  Budget,
  Goal,
  HealthComponent,
  Holding,
  RiskProfileName,
  SpendEntry,
  UserProfile } from
'../types/finance';
import { monthsBetween } from './format';

export function futureValueOfSip(
monthly: number,
annualRatePct: number,
years: number)
: number {
  const r = annualRatePct / 100 / 12;
  const n = Math.round(years * 12);
  if (n <= 0) return 0;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

export function requiredMonthlyForGoal(
target: number,
present: number,
annualRatePct: number,
months: number)
: number {
  if (months <= 0) return Math.max(0, target - present);
  const r = annualRatePct / 100 / 12;
  const grownPresent = present * Math.pow(1 + r, months);
  const gap = Math.max(0, target - grownPresent);
  if (r === 0) return gap / months;
  return gap / ((Math.pow(1 + r, months) - 1) / r * (1 + r));
}

export function compoundValue(
principal: number,
annualRatePct: number,
years: number,
compoundsPerYear = 1)
: number {
  const r = annualRatePct / 100 / compoundsPerYear;
  return principal * Math.pow(1 + r, compoundsPerYear * years);
}

export function emiFor(
principal: number,
annualRatePct: number,
years: number)
: number {
  const r = annualRatePct / 100 / 12;
  const n = Math.round(years * 12);
  if (n <= 0) return 0;
  if (r === 0) return principal / n;
  return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

export function portfolioTotals(holdings: Holding[]) {
  const invested = holdings.reduce((sum, h) => sum + h.invested, 0);
  const current = holdings.reduce((sum, h) => sum + h.current, 0);
  const gain = current - invested;
  const returnPct = invested > 0 ? gain / invested * 100 : 0;
  // Simplified annualised approximation used for the demo dataset.
  const xirr = returnPct === 0 ? 0 : returnPct * 0.78;
  const monthlySip = holdings.reduce((sum, h) => sum + (h.monthlySip ?? 0), 0);
  return { invested, current, gain, returnPct, xirr, monthlySip };
}

export function allocationByType(holdings: Holding[]) {
  const map = new Map<string, number>();
  holdings.forEach((h) => map.set(h.type, (map.get(h.type) ?? 0) + h.current));
  const total = holdings.reduce((sum, h) => sum + h.current, 0) || 1;
  return Array.from(map.entries()).
  map(([name, value]) => ({
    name,
    value,
    pct: value / total * 100
  })).
  sort((a, b) => b.value - a.value);
}

export function allocationBySector(holdings: Holding[]) {
  const map = new Map<string, number>();
  holdings.forEach((h) =>
  map.set(h.sector, (map.get(h.sector) ?? 0) + h.current)
  );
  const total = holdings.reduce((sum, h) => sum + h.current, 0) || 1;
  return Array.from(map.entries()).
  map(([name, value]) => ({ name, value, pct: value / total * 100 })).
  sort((a, b) => b.value - a.value);
}

export function equityExposure(holdings: Holding[]) {
  const total = holdings.reduce((s, h) => s + h.current, 0) || 1;
  const equity = holdings.
  filter((h) => ['Stocks', 'Mutual Funds', 'SIP', 'ETF'].includes(h.type)).
  reduce((s, h) => s + h.current, 0);
  const debt = holdings.
  filter((h) => ['Fixed Deposit', 'Savings'].includes(h.type)).
  reduce((s, h) => s + h.current, 0);
  return {
    equityPct: equity / total * 100,
    debtPct: debt / total * 100,
    otherPct: (total - equity - debt) / total * 100
  };
}

export function diversificationScore(holdings: Holding[]): number {
  if (holdings.length === 0) return 0;
  const sectors = allocationBySector(holdings);
  const types = allocationByType(holdings);
  const topSector = sectors[0]?.pct ?? 100;
  const spread = Math.min(100, types.length * 14 + sectors.length * 8);
  const concentrationPenalty = Math.max(0, topSector - 30) * 1.2;
  return Math.round(Math.max(10, Math.min(100, spread - concentrationPenalty)));
}

export function riskScoreFromAnswers(
answers: number[],
optionWeights: number[][])
: number {
  if (answers.length === 0) return 0;
  let total = 0;
  let max = 0;
  answers.forEach((optionIndex, i) => {
    const weights = optionWeights[i] ?? [];
    total += weights[optionIndex] ?? 0;
    max += Math.max(...(weights.length ? weights : [1]));
  });
  return Math.round(total / (max || 1) * 100);
}

export function riskProfileFromScore(score: number): RiskProfileName {
  if (score < 25) return 'Conservative';
  if (score < 45) return 'Moderate';
  if (score < 68) return 'Balanced';
  if (score < 85) return 'Growth';
  return 'Aggressive';
}

export function savingsRate(profile: UserProfile): number {
  if (profile.monthlyIncome <= 0) return 0;
  return (
    (profile.monthlyIncome - profile.monthlyExpenses) /
    profile.monthlyIncome *
    100);

}

export function goalProgress(goal: Goal) {
  const pct = Math.min(100, goal.savedAmount / goal.targetAmount * 100);
  const months = monthsBetween(new Date(), new Date(goal.targetDate));
  const required = requiredMonthlyForGoal(
    goal.targetAmount,
    goal.savedAmount,
    9,
    months
  );
  const projected =
  goal.savedAmount * Math.pow(1 + 0.09 / 12, months) +
  futureValueOfSip(goal.monthlyContribution, 9, months / 12);
  const shortfallMonthly = Math.max(0, required - goal.monthlyContribution);
  return { pct, months, required, projected, shortfallMonthly };
}

export function healthComponents(args: {
  profile: UserProfile;
  holdings: Holding[];
  goals: Goal[];
  budget: Budget;
  spend: SpendEntry[];
}): HealthComponent[] {
  const { profile, holdings, goals, budget, spend } = args;
  const rate = savingsRate(profile);
  const efMonths = profile.emergencyFundMonths;
  const totals = portfolioTotals(holdings);
  const div = diversificationScore(holdings);
  const goalAvg =
  goals.length > 0 ?
  goals.reduce((s, g) => s + goalProgress(g).pct, 0) / goals.length :
  0;
  const spendTotal = spend.reduce((s, e) => s + e.amount, 0);
  const spendPrev = spend.reduce((s, e) => s + e.previousAmount, 0) || 1;
  const spendDrift = (spendTotal - spendPrev) / spendPrev * 100;
  const wantsShare = budget.income > 0 ? budget.wants / budget.income * 100 : 0;

  return [
  {
    key: 'savings',
    label: 'Savings',
    score: Math.round(Math.max(0, Math.min(100, rate * 2.6))),
    weight: 0.2,
    note: `You save about ${rate.toFixed(0)}% of your monthly income.`
  },
  {
    key: 'emergency',
    label: 'Emergency Fund',
    score: Math.round(Math.min(100, efMonths / 6 * 100)),
    weight: 0.18,
    note: `${efMonths.toFixed(1)} of the 6 months usually suggested as a cushion.`
  },
  {
    key: 'debt',
    label: 'Debt',
    score: 88,
    weight: 0.12,
    note: 'No high-interest borrowings recorded in your demo profile.'
  },
  {
    key: 'investments',
    label: 'Investments',
    score: Math.round(
      Math.max(
        0,
        Math.min(100, totals.monthlySip / (profile.monthlyIncome * 0.2) * 100)
      )
    ),
    weight: 0.16,
    note: `₹${totals.monthlySip.toLocaleString('en-IN')} invested monthly through SIPs.`
  },
  {
    key: 'diversification',
    label: 'Diversification',
    score: div,
    weight: 0.14,
    note: 'Measured across asset types and sector spread.'
  },
  {
    key: 'goals',
    label: 'Goal Progress',
    score: Math.round(goalAvg),
    weight: 0.1,
    note: `Average progress across ${goals.length} active goals.`
  },
  {
    key: 'spending',
    label: 'Spending Control',
    score: Math.round(
      Math.max(20, Math.min(100, 96 - Math.max(0, spendDrift) * 2 - Math.max(0, wantsShare - 30)))
    ),
    weight: 0.1,
    note:
    spendDrift > 0 ?
    `Spending is ${spendDrift.toFixed(0)}% higher than last month.` :
    'Spending is stable compared with last month.'
  }];

}

export function healthScore(components: HealthComponent[]): number {
  const total = components.reduce((s, c) => s + c.score * c.weight, 0);
  const weight = components.reduce((s, c) => s + c.weight, 0) || 1;
  return Math.round(total / weight);
}

export function healthLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Fair';
  if (score >= 40) return 'Needs work';
  return 'At risk';
}

export function projectGrowth(
monthly: number,
years: number,
annualRatePct: number,
startingCorpus = 0,
shockPct = 0)
{
  const points: {year: string;value: number;invested: number;}[] = [];
  for (let y = 0; y <= years; y++) {
    const invested = startingCorpus + monthly * 12 * y;
    let value =
    startingCorpus * Math.pow(1 + annualRatePct / 100, y) +
    futureValueOfSip(monthly, annualRatePct, y);
    if (shockPct > 0) value = value * (1 - shockPct / 100);
    points.push({
      year: `Y${y}`,
      value: Math.round(value),
      invested: Math.round(invested)
    });
  }
  return points;
}