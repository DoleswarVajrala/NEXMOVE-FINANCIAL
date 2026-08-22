import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState } from
'react';
import type {
  Budget,
  Goal,
  Holding,
  Insight,
  MonthlyPoint,
  NextMove,
  NotificationItem,
  SpendEntry,
  UserProfile } from
'../types/finance';
import {
  demoBudget,
  demoGoals,
  demoHoldings,
  demoMonthly,
  demoNotifications,
  demoProfile,
  demoSpend,
  emptyProfile } from
'../data/demo';
import { riskOptionWeights } from '../data/riskQuestions';
import {
  diversificationScore,
  goalProgress,
  healthComponents,
  healthScore,
  portfolioTotals,
  riskProfileFromScore,
  riskScoreFromAnswers,
  savingsRate,
  allocationBySector } from
'../utils/finance';
import { formatINR } from '../utils/format';

const STORAGE_KEY = 'nexmove-state-v1';

interface PersistedState {
  signedIn: boolean;
  demoMode: boolean;
  onboarded: boolean;
  profile: UserProfile;
  holdings: Holding[];
  goals: Goal[];
  budget: Budget;
  spend: SpendEntry[];
  monthly: MonthlyPoint[];
  riskAnswers: number[];
  notifications: NotificationItem[];
  completedTopics: string[];
  completedMoves: string[];
  theme: 'light' | 'dark';
}

const initialState: PersistedState = {
  signedIn: false,
  demoMode: false,
  onboarded: false,
  profile: emptyProfile,
  holdings: [],
  goals: [],
  budget: { income: 0, needs: 0, wants: 0, savings: 0, investments: 0 },
  spend: [],
  monthly: [],
  riskAnswers: [],
  notifications: [],
  completedTopics: [],
  completedMoves: [],
  theme: 'light'
};

interface NexmoveContextValue extends PersistedState {
  totals: ReturnType<typeof portfolioTotals>;
  riskScore: number;
  riskProfile: ReturnType<typeof riskProfileFromScore>;
  savingsRatePct: number;
  health: {score: number;components: ReturnType<typeof healthComponents>;};
  insights: Insight[];
  nextMoves: NextMove[];
  diversification: number;
  unreadCount: number;
  startDemo: () => void;
  signIn: (email: string) => void;
  signOut: () => void;
  resetDemo: () => void;
  completeOnboarding: (profile: UserProfile) => void;
  setRiskAnswers: (answers: number[]) => void;
  addHolding: (holding: Omit<Holding, 'id'>) => void;
  removeHolding: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  updateBudget: (patch: Partial<Budget>) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  toggleTopic: (id: string) => void;
  completeMove: (id: string) => void;
  toggleTheme: () => void;
}

const NexmoveContext = createContext<NexmoveContextValue | null>(null);

function load(): PersistedState {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    return { ...initialState, ...(JSON.parse(raw) as PersistedState) };
  } catch {
    return initialState;
  }
}

export function NexmoveProvider({ children }: {children: React.ReactNode;}) {
  const [state, setState] = useState<PersistedState>(load);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {

      /* storage unavailable in preview sandboxes */}
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  const patch = useCallback((next: Partial<PersistedState>) => {
    setState((prev) => ({ ...prev, ...next }));
  }, []);

  const startDemo = useCallback(() => {
    setState((prev) => ({
      ...prev,
      signedIn: true,
      demoMode: true,
      onboarded: true,
      profile: demoProfile,
      holdings: demoHoldings,
      goals: demoGoals,
      budget: demoBudget,
      spend: demoSpend,
      monthly: demoMonthly,
      riskAnswers: [2, 3, 2, 2, 3, 2, 2, 2],
      notifications: demoNotifications,
      completedTopics: ['sip', 'mutual-funds', 'compounding', 'risk'],
      completedMoves: []
    }));
  }, []);

  const signIn = useCallback(
    (email: string) => {
      setState((prev) => ({
        ...prev,
        signedIn: true,
        profile: { ...prev.profile, email }
      }));
    },
    []
  );

  const signOut = useCallback(() => setState(initialState), []);
  const resetDemo = useCallback(() => {
    setState({ ...initialState, theme: state.theme });
  }, [state.theme]);

  const completeOnboarding = useCallback((profile: UserProfile) => {
    setState((prev) => ({
      ...prev,
      signedIn: true,
      onboarded: true,
      profile,
      budget:
      prev.budget.income > 0 ?
      prev.budget :
      {
        income: profile.monthlyIncome,
        needs: Math.round(profile.monthlyExpenses * 0.65),
        wants: Math.round(profile.monthlyExpenses * 0.35),
        savings: Math.round(
          (profile.monthlyIncome - profile.monthlyExpenses) * 0.6
        ),
        investments: Math.round(
          (profile.monthlyIncome - profile.monthlyExpenses) * 0.4
        )
      },
      monthly: prev.monthly.length ? prev.monthly : demoMonthly,
      notifications: prev.notifications.length ?
      prev.notifications :
      demoNotifications.slice(1, 3)
    }));
  }, []);

  const setRiskAnswers = useCallback(
    (answers: number[]) => patch({ riskAnswers: answers }),
    [patch]
  );

  const addHolding = useCallback((holding: Omit<Holding, 'id'>) => {
    setState((prev) => ({
      ...prev,
      holdings: [...prev.holdings, { ...holding, id: `h${Date.now()}` }]
    }));
  }, []);

  const removeHolding = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      holdings: prev.holdings.filter((h) => h.id !== id)
    }));
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, 'id'>) => {
    setState((prev) => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: `g${Date.now()}` }]
    }));
  }, []);

  const updateGoal = useCallback((id: string, next: Partial<Goal>) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => g.id === id ? { ...g, ...next } : g)
    }));
  }, []);

  const removeGoal = useCallback((id: string) => {
    setState((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }));
  }, []);

  const updateBudget = useCallback((next: Partial<Budget>) => {
    setState((prev) => ({ ...prev, budget: { ...prev.budget, ...next } }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
      )
    }));
  }, []);

  const markAllRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true }))
    }));
  }, []);

  const toggleTopic = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      completedTopics: prev.completedTopics.includes(id) ?
      prev.completedTopics.filter((t) => t !== id) :
      [...prev.completedTopics, id]
    }));
  }, []);

  const completeMove = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      completedMoves: prev.completedMoves.includes(id) ?
      prev.completedMoves :
      [...prev.completedMoves, id]
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  }, []);

  const value = useMemo<NexmoveContextValue>(() => {
    const totals = portfolioTotals(state.holdings);
    const riskScore = state.riskAnswers.length ?
    riskScoreFromAnswers(state.riskAnswers, riskOptionWeights) :
    0;
    const riskProfile = riskProfileFromScore(riskScore);
    const components = healthComponents({
      profile: state.profile,
      holdings: state.holdings,
      goals: state.goals,
      budget: state.budget,
      spend: state.spend
    });
    const score = state.onboarded ? healthScore(components) : 0;
    const diversification = diversificationScore(state.holdings);
    const sectors = allocationBySector(state.holdings);
    const topSector = sectors[0];

    const insights: Insight[] = [];
    const efPct = Math.min(100, state.profile.emergencyFundMonths / 6 * 100);
    if (state.onboarded) {
      insights.push({
        id: 'i-ef',
        tone: efPct >= 100 ? 'positive' : 'info',
        title: `Your emergency fund is ${efPct.toFixed(0)}% complete.`,
        detail:
        efPct >= 100 ?
        'You have a full six-month cushion, which protects your investments during income gaps.' :
        'Reaching six months of expenses means you never have to sell investments during a rough month.',
        actionLabel: efPct >= 100 ? 'Review goal' : 'Fix It',
        actionPath: '/goals'
      });

      const shopping = state.spend.find((s) => s.category === 'Shopping');
      if (shopping && shopping.amount > shopping.previousAmount) {
        const drift =
        (shopping.amount - shopping.previousAmount) /
        shopping.previousAmount *
        100;
        insights.push({
          id: 'i-spend',
          tone: 'attention',
          title: `Your shopping expenses increased ${drift.toFixed(0)}% this month.`,
          detail: `That is ${formatINR(
            shopping.amount - shopping.previousAmount
          )} more than last month. Adjust the budget or the habit — both are valid choices.`,
          actionLabel: 'Fix It',
          actionPath: '/spending'
        });
      }

      if (topSector && topSector.pct > 25) {
        insights.push({
          id: 'i-conc',
          tone: 'caution',
          title: `Your portfolio leans heavily on ${topSector.name}.`,
          detail: `${topSector.pct.toFixed(
            0
          )}% of your holdings sit in one sector. Spreading exposure reduces how much one industry decides your outcome.`,
          actionLabel: 'Fix It',
          actionPath: '/portfolio'
        });
      }

      const eduGoal = state.goals.find((g) => g.name.includes('Education'));
      if (eduGoal) {
        const gp = goalProgress(eduGoal);
        insights.push({
          id: 'i-goal',
          tone: gp.shortfallMonthly > 0 ? 'info' : 'positive',
          title:
          gp.shortfallMonthly > 0 ?
          `You are ${formatINR(
            gp.shortfallMonthly
          )}/month away from your education goal.` :
          'Your education goal is on track at the current contribution.',
          detail: `Target ${formatINR(eduGoal.targetAmount)} by ${new Date(
            eduGoal.targetDate
          ).getFullYear()}, with ${gp.pct.toFixed(0)}% saved so far.`,
          actionLabel: 'Fix It',
          actionPath: '/goals'
        });
      }

      const equityHeavy = riskScore > 0 && riskScore < 60 && totals.current > 0;
      if (equityHeavy) {
        insights.push({
          id: 'i-risk',
          tone: 'caution',
          title:
          'Your allocation may be more aggressive than your selected risk profile.',
          detail:
          'Your holdings tilt strongly toward equity while your answers suggest a more measured comfort with swings.',
          actionLabel: 'Fix It',
          actionPath: '/risk'
        });
      }
    }

    const moves: NextMove[] = [];
    if (state.onboarded) {
      if (state.profile.emergencyFundMonths < 6) {
        moves.push({
          id: 'm1',
          title: 'Top up your emergency fund',
          reason: `You have ${state.profile.emergencyFundMonths.toFixed(
            1
          )} months of expenses saved against a 6-month cushion.`,
          impact: 'Protects long-term investments from short-term shocks',
          priority: 'High',
          path: '/goals',
          actionLabel: 'Open goal',
          done: state.completedMoves.includes('m1')
        });
      }
      moves.push({
        id: 'm2',
        title: 'Trim one recurring discretionary expense',
        reason: 'Shopping and entertainment rose faster than income this month.',
        impact: `Frees roughly ${formatINR(1500)}/month for investing`,
        priority: 'Medium',
        path: '/spending',
        actionLabel: 'Review spending',
        done: state.completedMoves.includes('m2')
      });
      if (diversification < 75) {
        moves.push({
          id: 'm3',
          title: 'Review portfolio diversification',
          reason: `Your diversification score is ${diversification}/100, driven by sector concentration.`,
          impact: 'Reduces dependence on a single sector outcome',
          priority: 'High',
          path: '/portfolio',
          actionLabel: 'Analyse portfolio',
          done: state.completedMoves.includes('m3')
        });
      }
      moves.push({
        id: 'm4',
        title: 'Increase your SIP by ₹1,000',
        reason: 'Your savings rate leaves headroom above your current SIP total.',
        impact: 'Could add roughly ₹2.3 lakh over 10 years at an assumed 12%',
        priority: 'Medium',
        path: '/what-if',
        actionLabel: 'Simulate it',
        done: state.completedMoves.includes('m4')
      });
      moves.push({
        id: 'm5',
        title: 'Finish two Learn modules',
        reason: 'Understanding risk and allocation improves decision confidence.',
        impact: 'Raises your financial knowledge score',
        priority: 'Low',
        path: '/learn',
        actionLabel: 'Start learning',
        done: state.completedMoves.includes('m5')
      });
    }

    return {
      ...state,
      totals,
      riskScore,
      riskProfile,
      savingsRatePct: savingsRate(state.profile),
      health: { score, components },
      insights: insights.slice(0, 5),
      nextMoves: moves,
      diversification,
      unreadCount: state.notifications.filter((n) => !n.read).length,
      startDemo,
      signIn,
      signOut,
      resetDemo,
      completeOnboarding,
      setRiskAnswers,
      addHolding,
      removeHolding,
      addGoal,
      updateGoal,
      removeGoal,
      updateBudget,
      markNotificationRead,
      markAllRead,
      toggleTopic,
      completeMove,
      toggleTheme
    };
  }, [
  state,
  startDemo,
  signIn,
  signOut,
  resetDemo,
  completeOnboarding,
  setRiskAnswers,
  addHolding,
  removeHolding,
  addGoal,
  updateGoal,
  removeGoal,
  updateBudget,
  markNotificationRead,
  markAllRead,
  toggleTopic,
  completeMove,
  toggleTheme]
  );

  return (
    <NexmoveContext.Provider value={value}>{children}</NexmoveContext.Provider>);

}

export function useNexmove(): NexmoveContextValue {
  const ctx = useContext(NexmoveContext);
  if (!ctx) throw new Error('useNexmove must be used inside NexmoveProvider');
  return ctx;
}