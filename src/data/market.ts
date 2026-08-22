export const indices = [
{ name: 'NIFTY 50', value: 24812.4, change: 0.62 },
{ name: 'SENSEX', value: 81290.1, change: 0.48 },
{ name: 'NIFTY BANK', value: 52140.9, change: -0.31 },
{ name: 'NIFTY MIDCAP 100', value: 58204.7, change: 1.12 }];


export const indexTrend = [
{ day: 'Mon', nifty: 24480 },
{ day: 'Tue', nifty: 24610 },
{ day: 'Wed', nifty: 24390 },
{ day: 'Thu', nifty: 24705 },
{ day: 'Fri', nifty: 24812 }];


export const sectors = [
{ name: 'Technology', change: 1.8 },
{ name: 'Financials', change: -0.4 },
{ name: 'Auto', change: 2.1 },
{ name: 'Pharma', change: 0.9 },
{ name: 'FMCG', change: -0.2 },
{ name: 'Energy', change: 1.1 }];


export const marketNews = [
{
  id: 'm1',
  headline: 'Index volatility rises ahead of policy commentary',
  sentiment: 'Neutral',
  summary:
  'Short-term swings widened this week. Volatility describes uncertainty, not direction — it does not predict whether markets rise or fall next.'
},
{
  id: 'm2',
  headline: 'Midcap valuations remain above long-term averages',
  sentiment: 'Caution',
  summary:
  'Higher valuations historically mean investors pay more for the same earnings. This raises the importance of a longer holding horizon.'
},
{
  id: 'm3',
  headline: 'Domestic SIP inflows stay steady',
  sentiment: 'Positive',
  summary:
  'Consistent monthly investing has continued across retail investors, which typically reduces the impact of trying to time entry points.'
}];


export const hypeVsData = {
  claim: '“Everyone is buying this stock — it will double in 3 months!”',
  ticker: 'MOMENTUM AUTO LTD (illustrative example)',
  metrics: [
  { label: 'Valuation (P/E)', value: '68.4', context: 'Sector median is 24.1' },
  { label: '3-year return', value: '+212%', context: 'Most of it came in the last 7 months' },
  { label: 'Volatility', value: 'High', context: 'Daily swings of 4–6% are common' },
  { label: 'Fundamentals', value: 'Mixed', context: 'Revenue growing, margins compressing' },
  { label: 'Debt to equity', value: '1.6x', context: 'Above the sector average of 0.7x' },
  { label: 'Promoter holding', value: '38%', context: 'Reduced by 4% over the last year' }],

  verdict:
  'Popularity is not a valuation method. The data shows a fast run-up, elevated pricing and high volatility — which means both larger gains and larger losses are possible. Don’t invest because of hype. Understand the data first.'
};