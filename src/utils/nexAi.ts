import type { Goal, Holding, UserProfile } from '../types/finance';
import { formatINR } from './format';
import {
  allocationBySector,
  futureValueOfSip,
  goalProgress,
  portfolioTotals,
  savingsRate } from
'./finance';

export interface AiContext {
  profile: UserProfile;
  holdings: Holding[];
  goals: Goal[];
  riskScore: number;
  riskProfile: string;
  healthScore: number;
  monthlySpend: number;
}

export const suggestedPrompts = [
'Analyze my finances',
'Explain my risk',
'Help me reach my goal',
'Find my unnecessary spending',
'Should I start an SIP?',
'What is a mutual fund?',
'How much SIP do I need for ₹10 lakh?',
'Can I afford a ₹50,000 phone?'];


export function answerFor(question: string, ctx: AiContext): string {
  const q = question.toLowerCase();
  const totals = portfolioTotals(ctx.holdings);
  const surplus = ctx.profile.monthlyIncome - ctx.profile.monthlyExpenses;
  const rate = savingsRate(ctx.profile);

  if (q.includes('analyz') || q.includes('analys') || q.includes('my finances')) {
    return `Here is your picture in plain language. You earn ${formatINR(
      ctx.profile.monthlyIncome
    )} and spend ${formatINR(ctx.profile.monthlyExpenses)}, so you keep ${formatINR(
      surplus
    )} a month — a savings rate of ${rate.toFixed(
      0
    )}%. Your investments are worth ${formatINR(
      totals.current
    )} against ${formatINR(
      totals.invested
    )} invested. Your financial health score is ${ctx.healthScore}/100. The strongest lever right now is protecting the safety net first and spreading your equity across more sectors before adding new money.`;
  }

  if (q.includes('risk')) {
    return `Your risk score is ${ctx.riskScore}/100, which places you as a ${ctx.riskProfile} investor. That comes from your investing experience, how long you can stay invested, how you said you would react to a fall, income stability and emergency savings. It means you can likely sit through moderate ups and downs, but a portfolio that swings far more than that would probably feel uncomfortable — and comfort is what keeps people invested.`;
  }

  if (q.includes('sip') && (q.includes('10 lakh') || q.includes('1000000') || q.includes('10 lac'))) {
    const monthly = 1000000 / (futureValueOfSip(1, 12, 10) || 1);
    return `To reach ₹10 lakh in 10 years at an assumed 12% annual return, you would need roughly ${formatINR(
      monthly
    )} a month. If you only have 5 years, the number rises sharply to about ${formatINR(
      1000000 / (futureValueOfSip(1, 12, 5) || 1)
    )}. These are projections, not promises — actual returns vary and can be negative in some years.`;
  }

  if (q.includes('should i start') || q.includes('sip') && q.includes('start')) {
    return surplus > 0 ?
    `You have about ${formatINR(
      surplus
    )} of monthly surplus, so a SIP is reasonable to consider. A common sequence is: build 3–6 months of expenses as an emergency fund first, then start a small SIP in a diversified fund and increase it as income grows. Start with an amount you would not need to stop during a bad month.` :
    'Right now your expenses match or exceed your income, so the first step is creating a surplus rather than starting a SIP. Free up even ₹500 a month consistently — that habit matters more than the amount at this stage.';
  }

  if (q.includes('mutual fund')) {
    return 'A mutual fund pools money from many investors and buys a basket of stocks or bonds. You own units of that basket, so a small amount gives you exposure to many companies at once. It reduces the risk of any single company hurting you, but it still moves with the market. Look at what it invests in and its expense ratio before the past returns.';
  }

  if (q.includes('portfolio fall') || q.includes('why did my portfolio')) {
    const sectors = allocationBySector(ctx.holdings);
    const top = sectors[0];
    return `Portfolios fall when the assets inside them fall — usually because of broad market movement rather than anything you did wrong. In your case, ${
    top ? `${top.name} is ${top.pct.toFixed(0)}% of your holdings, so movement there has an outsized effect on your total.` : 'your holdings are spread fairly evenly, so any fall is likely market-wide.'} A fall is only a realised loss if you sell. The useful question is whether your allocation still matches your goals and timeline.`;

  }

  if (q.includes('afford')) {
    const match = question.match(/([\d,]{3,})/);
    const amount = match ? Number(match[1].replace(/,/g, '')) : 50000;
    const months = surplus > 0 ? Math.ceil(amount / surplus) : 0;
    return surplus > 0 ?
    `A ${formatINR(
      amount
    )} purchase equals about ${months} month${months === 1 ? '' : 's'} of your current surplus of ${formatINR(
      surplus
    )}. If buying it would dip into your emergency fund or pause your SIPs, it is worth delaying by a few months and saving for it deliberately instead.` :
    `With no monthly surplus right now, a ${formatINR(
      amount
    )} purchase would come out of savings or credit. It is worth waiting until you have a positive monthly surplus and a basic emergency cushion.`;
  }

  if (q.includes('goal')) {
    const goal = ctx.goals[0];
    if (!goal) return 'You have not created a goal yet. Add one in the Goals section and I will calculate the exact monthly amount needed to reach it.';
    const gp = goalProgress(goal);
    return `Your nearest goal is ${goal.name}: ${formatINR(
      goal.savedAmount
    )} saved of ${formatINR(goal.targetAmount)}, which is ${gp.pct.toFixed(
      0
    )}% complete with ${gp.months} months left. At an assumed 9% return you would need about ${formatINR(
      gp.required
    )} a month; you are currently putting in ${formatINR(
      goal.monthlyContribution
    )}. ${gp.shortfallMonthly > 0 ? `Increasing by ${formatINR(gp.shortfallMonthly)} would close the gap comfortably.` : 'You are on track at the current contribution.'}`;
  }

  if (q.includes('spend') || q.includes('unnecessary') || q.includes('expenses')) {
    return `You spend ${formatINR(
      ctx.monthlySpend
    )} a month. The categories that usually hide savings are shopping, food delivery and subscriptions — small repeated amounts rather than one large purchase. Trimming ₹1,500 a month and investing it instead could add roughly ${formatINR(
      futureValueOfSip(1500, 12, 10)
    )} over ten years at an assumed 12%. Look at the Spend Analysis page for the categories that moved most.`;
  }

  if (q.includes('save every month') || q.includes('how much should i save')) {
    return `A practical starting point is saving at least 20% of income. On ${formatINR(
      ctx.profile.monthlyIncome
    )}, that is ${formatINR(
      ctx.profile.monthlyIncome * 0.2
    )} a month. You currently keep ${formatINR(surplus)} (${rate.toFixed(
      0
    )}%). Split it between an emergency fund until you have 6 months of expenses, then investments for long-term goals.`;
  }

  if (q.includes('what is') || q.includes('explain')) {
    return 'Tell me the exact term or holding and I will explain it in plain language — what it is, how it makes or loses money, and what could go wrong. You can also open the Learn section for short lessons on SIPs, mutual funds, ETFs, risk, diversification and compounding.';
  }

  return `I can help with your savings, portfolio, goals, spending, risk and market questions. For context: you keep ${formatINR(
    surplus
  )} a month, your portfolio is worth ${formatINR(
    totals.current
  )}, and your financial health score is ${ctx.healthScore}/100. Try asking “Analyze my finances”, “Explain my risk” or “How much SIP do I need for ₹10 lakh?”.`;
}