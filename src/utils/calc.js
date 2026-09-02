// Core performance-marketing formulas. Pure functions, no side effects.
export const fmt = (n, digits=2) => {
  if (n === null || n === undefined || Number.isNaN(n) || !Number.isFinite(n)) return '—';
  return n.toLocaleString('ru-RU', { minimumFractionDigits:0, maximumFractionDigits:digits });
};
export const fmtMoney = (n, cur='€') => n===null||Number.isNaN(n)||!Number.isFinite(n) ? '—' : `${cur}${fmt(n)}`;
export const fmtPct = (n) => n===null||Number.isNaN(n)||!Number.isFinite(n) ? '—' : `${fmt(n)}%`;

export const ctr = (clicks, impressions) => impressions>0 ? (clicks/impressions)*100 : NaN;
export const cpc = (spend, clicks) => clicks>0 ? spend/clicks : NaN;
export const cpm = (spend, impressions) => impressions>0 ? (spend/impressions)*1000 : NaN;
export const conversionRate = (conversions, clicks) => clicks>0 ? (conversions/clicks)*100 : NaN;
export const cpa = (spend, conversions) => conversions>0 ? spend/conversions : NaN;
export const cpl = cpa;
export const roas = (revenue, spend) => spend>0 ? revenue/spend : NaN;
export const romi = (revenue, spend) => spend>0 ? ((revenue-spend)/spend)*100 : NaN;
export const roi = (profit, cost) => cost>0 ? (profit/cost)*100 : NaN;
export const breakEvenRoas = (marginPct) => marginPct>0 ? 100/marginPct : NaN; // marginPct e.g. 40 for 40%
export const maxAllowedCpa = (aov, marginPct) => aov * (marginPct/100);
export const ltv = (aov, purchasesPerYear, retentionYears) => aov*purchasesPerYear*retentionYears;
export const cac = (totalSpend, newCustomers) => newCustomers>0 ? totalSpend/newCustomers : NaN;
export const aov = (revenue, orders) => orders>0 ? revenue/orders : NaN;
export const paybackPeriodMonths = (cac, monthlyProfitPerCustomer) => monthlyProfitPerCustomer>0 ? cac/monthlyProfitPerCustomer : NaN;
export const forecastConversions = (budget, cpc, cvr) => cpc>0 ? (budget/cpc)*(cvr/100) : NaN;
export const forecastClicks = (budget, cpcVal) => cpcVal>0 ? budget/cpcVal : NaN;

export function splitBudget(total, weights){
  const sum = weights.reduce((a,b)=>a+b,0);
  return weights.map(w => sum>0 ? Math.round(total*(w/sum)) : 0);
}
