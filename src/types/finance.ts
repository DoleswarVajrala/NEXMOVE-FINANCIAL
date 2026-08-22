export type Persona = 'student' | 'professional' | 'first-time';

export type RiskProfileName =
'Conservative' |
'Moderate' |
'Balanced' |
'Growth' |
'Aggressive';

export type AssetType =
'Stocks' |
'Mutual Funds' |
'SIP' |
'ETF' |
'Fixed Deposit' |
'Gold' |
'Savings' |
'Other';

export type SpendCategory =
'Food' |
'Transport' |
'Shopping' |
'Education' |
'Entertainment' |
'Bills' |
'Rent' |
'Healthcare' |
'Other';

export interface Holding {
  id: string;
  name: string;
  type: AssetType;
  sector: string;
  invested: number;
  current: number;
  monthlySip?: number;
}

export interface Goal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  savedAmount: number;
  monthlyContribution: number;
  targetDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface SpendEntry {
  category: SpendCategory;
  amount: number;
  previousAmount: number;
}

export interface MonthlyPoint {
  month: string;
  spend: number;
  income: number;
  savings: number;
}

export interface Budget {
  income: number;
  needs: number;
  wants: number;
  savings: number;
  investments: number;
}

export interface RiskAnswer {
  questionId: string;
  optionIndex: number;
}

export interface UserProfile {
  name: string;
  age: number;
  persona: Persona;
  email: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  existingInvestments: number;
  experience: 'None' | 'Beginner' | 'Some' | 'Experienced';
  horizonYears: number;
  emergencyFundMonths: number;
  riskComfort: 'Low' | 'Medium' | 'High';
  goalTags: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  tone: 'positive' | 'info' | 'attention';
  time: string;
  read: boolean;
}

export interface Insight {
  id: string;
  tone: 'positive' | 'info' | 'attention' | 'caution';
  title: string;
  detail: string;
  actionLabel: string;
  actionPath: string;
}

export interface NextMove {
  id: string;
  title: string;
  reason: string;
  impact: string;
  priority: 'High' | 'Medium' | 'Low';
  path: string;
  actionLabel: string;
  done: boolean;
}

export interface LearnTopic {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  body: string[];
  example: string;
  quiz: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
}

export interface HealthComponent {
  key: string;
  label: string;
  score: number;
  weight: number;
  note: string;
}