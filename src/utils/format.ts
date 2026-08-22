export function formatINR(value: number, compact = false): string {
  const rounded = Math.round(value);
  if (compact) {
    if (Math.abs(rounded) >= 10000000)
    return `₹${(rounded / 10000000).toFixed(2)} Cr`;
    if (Math.abs(rounded) >= 100000)
    return `₹${(rounded / 100000).toFixed(2)} L`;
    if (Math.abs(rounded) >= 1000) return `₹${(rounded / 1000).toFixed(1)}K`;
  }
  return `₹${rounded.toLocaleString('en-IN')}`;
}

export function formatPercent(value: number, digits = 2): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
}

export function monthsBetween(from: Date, to: Date): number {
  const months =
  (to.getFullYear() - from.getFullYear()) * 12 + (
  to.getMonth() - from.getMonth());
  return Math.max(0, months);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}