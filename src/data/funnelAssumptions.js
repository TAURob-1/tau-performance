// Funnel conversion assumptions for downstream modelling
// These are configurable estimates until CRM data is connected.
// Source: industry benchmarks for UK subprime car finance brokers.

export const FUNNEL_ASSUMPTIONS = {
  // Application → Approved (credit check pass rate)
  approvalRate: 0.32,
  // Approved → Funded Deal (deal completion rate)
  fundingRate: 0.65,
  // Average revenue per funded deal (commission + fees)
  avgDealValue: 850,
  // Labels
  labels: {
    approvalRate: '32% approval rate (industry avg)',
    fundingRate: '65% funding rate (industry avg)',
    avgDealValue: '£850 avg deal value (est.)',
  },
};

// Compute downstream funnel metrics from platform data + assumptions
export function computeDealMetrics(cost, orders, revenue, assumptions = FUNNEL_ASSUMPTIONS) {
  const approvedEst = orders * assumptions.approvalRate;
  const fundedEst = approvedEst * assumptions.fundingRate;
  const revenueEst = fundedEst * assumptions.avgDealValue;

  // Use actual revenue if available, otherwise modeled
  const hasRevenue = revenue > 0;
  const effectiveRevenue = hasRevenue ? revenue : revenueEst;

  return {
    approvedEst: Math.round(approvedEst),
    fundedEst: Math.round(fundedEst),
    costPerDeal: fundedEst > 0 ? cost / fundedEst : 0,
    revenueEst,
    roi: cost > 0 ? ((effectiveRevenue - cost) / cost) * 100 : 0,
    roas: cost > 0 ? effectiveRevenue / cost : 0,
    hasActualRevenue: hasRevenue,
    actualRevenue: revenue,
  };
}
