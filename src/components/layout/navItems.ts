import {
  BellIcon,
  BookOpenIcon,
  BrainCircuitIcon,
  CalculatorIcon,
  GaugeIcon,
  LayoutDashboardIcon,
  LineChartIcon,
  PieChartIcon,
  ReceiptIndianRupeeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
  UserIcon,
  WalletIcon } from
'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: typeof GaugeIcon;
  group: 'Overview' | 'Decisions' | 'Grow';
}

export const navItems: NavItem[] = [
{ label: 'Dashboard', path: '/dashboard', icon: LayoutDashboardIcon, group: 'Overview' },
{ label: 'My Portfolio', path: '/portfolio', icon: PieChartIcon, group: 'Overview' },
{ label: 'Goals', path: '/goals', icon: TargetIcon, group: 'Overview' },
{ label: 'Budget', path: '/budget', icon: WalletIcon, group: 'Overview' },
{ label: 'Spend Analysis', path: '/spending', icon: ReceiptIndianRupeeIcon, group: 'Overview' },
{ label: 'Risk Profile', path: '/risk', icon: ShieldCheckIcon, group: 'Decisions' },
{ label: 'Market Insights', path: '/market', icon: LineChartIcon, group: 'Decisions' },
{ label: 'NEX AI', path: '/nex-ai', icon: BrainCircuitIcon, group: 'Decisions' },
{ label: 'What-If', path: '/what-if', icon: SparklesIcon, group: 'Decisions' },
{ label: 'Calculators', path: '/calculators', icon: CalculatorIcon, group: 'Grow' },
{ label: 'Learn', path: '/learn', icon: BookOpenIcon, group: 'Grow' },
{ label: 'Notifications', path: '/notifications', icon: BellIcon, group: 'Grow' },
{ label: 'Profile', path: '/profile', icon: UserIcon, group: 'Grow' }];


export const mobilePrimary = navItems.filter((i) =>
['/dashboard', '/portfolio', '/goals', '/nex-ai'].includes(i.path)
);