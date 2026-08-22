import type { LearnTopic } from '../types/finance';

export const learnTopics: LearnTopic[] = [
{
  id: 'sip',
  title: 'SIP',
  minutes: 4,
  summary: 'Investing a fixed amount every month instead of one lump sum.',
  body: [
  'A Systematic Investment Plan (SIP) means putting a fixed amount into a fund on the same date every month.',
  'Because you buy at different prices through the year, you avoid depending on one lucky entry point. This is called rupee cost averaging.',
  'SIPs do not guarantee profit. They mainly remove timing pressure and build the habit of investing regularly.'],

  example:
  '₹3,000 a month for 10 years at an assumed 12% could grow to roughly ₹6.9 lakh, of which ₹3.6 lakh is your own contribution.',
  quiz: {
    question: 'What does a SIP mainly protect you from?',
    options: [
    'Losing money in every market',
    'Depending on one entry price',
    'Paying any taxes'],

    answerIndex: 1,
    explanation:
    'SIPs spread your purchase across many prices. They reduce timing risk, not market risk.'
  }
},
{
  id: 'mutual-funds',
  title: 'Mutual Funds',
  minutes: 4,
  summary: 'A pooled basket of investments managed on your behalf.',
  body: [
  'A mutual fund collects money from many investors and buys a basket of stocks or bonds.',
  'You own units of the fund, so a single ₹500 investment can give you exposure to dozens of companies.',
  'Costs matter: the expense ratio is deducted every year, whether the fund performs well or not.'],

  example:
  'An index fund tracking the Nifty 50 gives you a small slice of 50 large Indian companies in one purchase.',
  quiz: {
    question: 'Why do mutual funds suit beginners?',
    options: [
    'They promise fixed returns',
    'They give instant diversification for a small amount',
    'They are insured by the government'],

    answerIndex: 1,
    explanation:
    'Diversification with a small ticket size is the main beginner advantage. Returns are never fixed.'
  }
},
{
  id: 'stocks',
  title: 'Stocks',
  minutes: 3,
  summary: 'Part ownership in a single company.',
  body: [
  'Buying a share means owning a small part of a business and its future profits.',
  'Single stocks move far more sharply than diversified funds because everything depends on one company.',
  'Understanding what the business earns matters more than what people say about it online.'],

  example:
  'If one stock is 40% of your portfolio, a 30% fall in that one company reduces your entire portfolio by 12%.',
  quiz: {
    question: 'What is the main risk of a concentrated stock position?',
    options: [
    'One company can move your whole portfolio',
    'Stocks cannot be sold',
    'Dividends are guaranteed'],

    answerIndex: 0,
    explanation:
    'Concentration means one company’s outcome decides your result. Diversification reduces that.'
  }
},
{
  id: 'etf',
  title: 'ETFs',
  minutes: 3,
  summary: 'Funds that trade on the exchange like a stock.',
  body: [
  'An ETF holds a basket of securities but trades throughout the day on the exchange.',
  'Most ETFs track an index, so costs are usually lower than actively managed funds.',
  'You need a demat account, and liquidity varies between ETFs.'],

  example:
  'A Nifty Next 50 ETF lets you track 50 emerging large companies with one order.',
  quiz: {
    question: 'How is an ETF different from a regular mutual fund?',
    options: [
    'It trades live on the exchange',
    'It cannot lose value',
    'It only holds bonds'],

    answerIndex: 0,
    explanation:
    'The key difference is intraday trading on an exchange at market prices.'
  }
},
{
  id: 'risk',
  title: 'Risk',
  minutes: 3,
  summary: 'The chance that your actual outcome differs from your expectation.',
  body: [
  'Risk is not only the chance of losing money — it is uncertainty in both directions.',
  'Higher expected returns always come with wider possible outcomes.',
  'The right level of risk is the one you can hold through a bad year without selling.'],

  example:
  'An equity fund may return 30% one year and fall 18% the next while still averaging around 12% over a decade.',
  quiz: {
    question: 'What does higher risk actually mean?',
    options: [
    'Guaranteed higher returns',
    'A wider range of possible outcomes',
    'No chance of loss'],

    answerIndex: 1,
    explanation:
    'Risk widens the range of outcomes. It never guarantees the good end of that range.'
  }
},
{
  id: 'diversification',
  title: 'Diversification',
  minutes: 3,
  summary: 'Spreading money so no single failure decides your outcome.',
  body: [
  'Diversification means holding assets that do not all move together.',
  'It spreads risk across companies, sectors and asset classes.',
  'It reduces the damage from being wrong about any one thing — it does not remove market risk.'],

  example:
  'Holding equity, debt and gold usually produces a smoother ride than equity alone.',
  quiz: {
    question: 'What does diversification remove?',
    options: [
    'All investment risk',
    'The impact of one holding failing',
    'The need to save'],

    answerIndex: 1,
    explanation:
    'It limits single-holding damage. Broad market falls still affect diversified portfolios.'
  }
},
{
  id: 'compounding',
  title: 'Compounding',
  minutes: 3,
  summary: 'Returns earning further returns over time.',
  body: [
  'Compounding means your gains start generating gains of their own.',
  'Time matters more than the amount in the early years.',
  'Starting two years earlier often beats investing a larger amount later.'],

  example:
  '₹5,000 monthly for 20 years at 12% is about ₹49 lakh, of which only ₹12 lakh is contributed.',
  quiz: {
    question: 'What matters most for compounding?',
    options: ['Time in the market', 'Picking a hot stock', 'Trading frequently'],
    answerIndex: 0,
    explanation: 'The longer money stays invested, the more growth builds on growth.'
  }
},
{
  id: 'inflation',
  title: 'Inflation',
  minutes: 3,
  summary: 'The quiet cost of keeping money idle.',
  body: [
  'Inflation reduces what the same rupee can buy in future.',
  'If savings earn 4% while inflation is 6%, your money loses purchasing power.',
  'Beating inflation is the minimum job of any long-term investment.'],

  example:
  '₹1,00,000 kept idle for 10 years at 6% inflation buys roughly ₹55,800 worth of goods.',
  quiz: {
    question: 'Why is idle cash risky over long periods?',
    options: [
    'It can be stolen',
    'Its purchasing power falls with inflation',
    'Banks charge for savings'],

    answerIndex: 1,
    explanation: 'Inflation quietly reduces what idle money can buy.'
  }
},
{
  id: 'emergency-fund',
  title: 'Emergency Fund',
  minutes: 3,
  summary: 'The cushion that protects your investments.',
  body: [
  'An emergency fund covers 3–6 months of essential expenses in a liquid account.',
  'It prevents you from selling investments during a market fall or taking expensive loans.',
  'Build this before increasing equity exposure.'],

  example:
  'If essentials cost ₹25,000 a month, a target cushion is ₹75,000 to ₹1,50,000.',
  quiz: {
    question: 'What should you build before increasing equity exposure?',
    options: ['A credit card limit', 'An emergency fund', 'A trading account'],
    answerIndex: 1,
    explanation:
    'The cushion is what lets you leave long-term investments untouched.'
  }
},
{
  id: 'asset-allocation',
  title: 'Asset Allocation',
  minutes: 4,
  summary: 'How you split money between equity, debt and gold.',
  body: [
  'Allocation usually explains more of your outcome than individual product picks.',
  'It should reflect your goal timeline and your risk comfort.',
  'Rebalancing back to your target once a year keeps risk from drifting upward.'],

  example:
  'A balanced investor might target 60% equity, 30% debt and 10% gold.',
  quiz: {
    question: 'Why rebalance periodically?',
    options: [
    'To lock in guaranteed profits',
    'To stop risk from drifting away from your plan',
    'To avoid taxes'],

    answerIndex: 1,
    explanation:
    'After a strong equity run, equity share rises and so does portfolio risk.'
  }
},
{
  id: 'long-term',
  title: 'Long-term Investing',
  minutes: 3,
  summary: 'Why patience is a strategy, not a personality trait.',
  body: [
  'Short-term market movement is mostly noise; long-term outcomes follow earnings growth.',
  'Frequent switching usually adds cost and reduces returns.',
  'A written plan makes it easier to sit through volatile periods.'],

  example:
  'Historically, longer holding periods have narrowed the range of equity outcomes — though never eliminated risk.',
  quiz: {
    question: 'What usually hurts long-term returns most?',
    options: [
    'Staying invested',
    'Frequent reacting and switching',
    'Automating SIPs'],

    answerIndex: 1,
    explanation:
    'Reacting to short-term noise adds cost and often locks in losses.'
  }
}];