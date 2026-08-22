import type {
  Budget,
  Goal,
  Holding,
  MonthlyPoint,
  NotificationItem,
  SpendEntry,
  UserProfile } from
'../types/finance';

export const BRAND_IMAGE = "/PHOTO-2026-08-21-19-42-42.jpg";


export const DISCLAIMER =
'NEXMOVE provides educational and personalized financial insights. Investment decisions involve risk. Past performance does not guarantee future returns.';

export const demoProfile: UserProfile = {
  name: 'Aarav Sharma',
  age: 27,
  persona: 'professional',
  email: 'demo@nexmove.in',
  monthlyIncome: 45000,
  monthlyExpenses: 28000,
  currentSavings: 145000,
  existingInvestments: 485000,
  experience: 'Some',
  horizonYears: 12,
  emergencyFundMonths: 4.2,
  riskComfort: 'Medium',
  goalTags: ['Emergency fund', 'Higher education', 'Retirement']
};

export const demoHoldings: Holding[] = [
{
  id: 'h1',
  name: 'HDFC Bank',
  type: 'Stocks',
  sector: 'Financials',
  invested: 62000,
  current: 71400
},
{
  id: 'h2',
  name: 'Infosys',
  type: 'Stocks',
  sector: 'Technology',
  invested: 48000,
  current: 52800
},
{
  id: 'h3',
  name: 'Tata Motors',
  type: 'Stocks',
  sector: 'Automobile',
  invested: 35000,
  current: 33100
},
{
  id: 'h4',
  name: 'Parag Parikh Flexi Cap',
  type: 'Mutual Funds',
  sector: 'Diversified',
  invested: 84000,
  current: 102300
},
{
  id: 'h5',
  name: 'Nippon Small Cap SIP',
  type: 'SIP',
  sector: 'Small Cap',
  invested: 60000,
  current: 74600,
  monthlySip: 4000
},
{
  id: 'h6',
  name: 'UTI Nifty 50 Index SIP',
  type: 'SIP',
  sector: 'Diversified',
  invested: 45000,
  current: 51900,
  monthlySip: 3000
},
{
  id: 'h7',
  name: 'Nifty Next 50 ETF',
  type: 'ETF',
  sector: 'Diversified',
  invested: 26000,
  current: 28900
},
{
  id: 'h8',
  name: 'SBI Fixed Deposit',
  type: 'Fixed Deposit',
  sector: 'Debt',
  invested: 30000,
  current: 32000
},
{
  id: 'h9',
  name: 'Sovereign Gold Bond',
  type: 'Gold',
  sector: 'Commodity',
  invested: 20000,
  current: 23000
},
{
  id: 'h10',
  name: 'Savings Account',
  type: 'Savings',
  sector: 'Cash',
  invested: 10000,
  current: 15000
}];


export const demoGoals: Goal[] = [
{
  id: 'g1',
  name: 'Emergency Fund',
  icon: 'shield',
  targetAmount: 180000,
  savedAmount: 126000,
  monthlyContribution: 6000,
  targetDate: '2027-06-30',
  priority: 'High'
},
{
  id: 'g2',
  name: 'Higher Education',
  icon: 'graduation',
  targetAmount: 600000,
  savedAmount: 185000,
  monthlyContribution: 7000,
  targetDate: '2030-04-30',
  priority: 'High'
},
{
  id: 'g3',
  name: 'Buy a Laptop',
  icon: 'laptop',
  targetAmount: 80000,
  savedAmount: 35000,
  monthlyContribution: 4875,
  targetDate: '2027-04-30',
  priority: 'Medium'
},
{
  id: 'g4',
  name: 'Goa Vacation',
  icon: 'plane',
  targetAmount: 60000,
  savedAmount: 14000,
  monthlyContribution: 2500,
  targetDate: '2027-12-31',
  priority: 'Low'
}];


export const demoBudget: Budget = {
  income: 45000,
  needs: 20000,
  wants: 8000,
  savings: 10000,
  investments: 7000
};

export const demoSpend: SpendEntry[] = [
{ category: 'Rent', amount: 11000, previousAmount: 11000 },
{ category: 'Food', amount: 6200, previousAmount: 5000 },
{ category: 'Shopping', amount: 4100, previousAmount: 3400 },
{ category: 'Transport', amount: 2100, previousAmount: 2200 },
{ category: 'Bills', amount: 1800, previousAmount: 1750 },
{ category: 'Entertainment', amount: 1500, previousAmount: 1150 },
{ category: 'Education', amount: 800, previousAmount: 800 },
{ category: 'Healthcare', amount: 300, previousAmount: 900 },
{ category: 'Other', amount: 200, previousAmount: 400 }];


export const demoMonthly: MonthlyPoint[] = [
{ month: 'Mar', income: 45000, spend: 26200, savings: 18800 },
{ month: 'Apr', income: 45000, spend: 27500, savings: 17500 },
{ month: 'May', income: 45000, spend: 25400, savings: 19600 },
{ month: 'Jun', income: 45000, spend: 28900, savings: 16100 },
{ month: 'Jul', income: 45000, spend: 26600, savings: 18400 },
{ month: 'Aug', income: 45000, spend: 28000, savings: 17000 }];


export const portfolioTrend = [
{ month: 'Mar', value: 402000, invested: 372000 },
{ month: 'Apr', value: 418500, invested: 384000 },
{ month: 'May', value: 431000, invested: 396000 },
{ month: 'Jun', value: 425400, invested: 405000 },
{ month: 'Jul', value: 462800, invested: 413000 },
{ month: 'Aug', value: 485000, invested: 420000 }];


export const demoNotifications: NotificationItem[] = [
{
  id: 'n1',
  title: 'Shopping budget crossed',
  body: 'Shopping is ₹1,100 above your monthly plan. Review the category to decide whether to adjust the budget or the habit.',
  tone: 'attention',
  time: 'Today, 9:12 AM',
  read: false
},
{
  id: 'n2',
  title: 'Emergency fund milestone',
  body: 'Your emergency fund crossed 70%. That is roughly 4.2 months of expenses covered.',
  tone: 'positive',
  time: 'Yesterday',
  read: false
},
{
  id: 'n3',
  title: 'SIP debit reminder',
  body: 'Your ₹4,000 Nippon Small Cap SIP is scheduled for the 5th.',
  tone: 'info',
  time: '2 days ago',
  read: true
},
{
  id: 'n4',
  title: 'Portfolio concentration note',
  body: 'Financials make up a large share of your equity. Reviewing sector spread may reduce single-sector dependence.',
  tone: 'attention',
  time: '3 days ago',
  read: true
},
{
  id: 'n5',
  title: 'Market volatility context',
  body: 'Index volatility rose this week. Nothing needs to change automatically — check whether your allocation still matches your risk profile.',
  tone: 'info',
  time: '4 days ago',
  read: true
}];


export const emptyProfile: UserProfile = {
  name: '',
  age: 22,
  persona: 'student',
  email: '',
  monthlyIncome: 0,
  monthlyExpenses: 0,
  currentSavings: 0,
  existingInvestments: 0,
  experience: 'None',
  horizonYears: 5,
  emergencyFundMonths: 0,
  riskComfort: 'Low',
  goalTags: []
};