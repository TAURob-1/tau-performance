// Geo Incrementality Test data for 247 CarFinance
// Proposed test design based on TAU performance machine recommendations

export const GEO_TEST_CONFIG = {
  status: 'proposed', // proposed | running | complete
  channel: 'Google Ads',
  campaign: 'UK_GN_Performance_Max_Bad_Credit',
  objective: 'Determine true incremental lift of PMAX campaign on funded car finance applications',
  testPeriod: { start: '2026-04-14', end: '2026-05-12', weeks: 4 },
  budget: { daily: 4200, total: 117600 },
};

// UK regions split into exposed/holdout for geo test
export const UK_REGIONS = [
  { region: 'London', population: '9.0M', group: 'exposed', applications: 4200, spend: 42000, lift: null },
  { region: 'South East', population: '9.2M', group: 'exposed', applications: 3800, spend: 38000, lift: null },
  { region: 'North West', population: '7.4M', group: 'exposed', applications: 3100, spend: 31000, lift: null },
  { region: 'West Midlands', population: '5.9M', group: 'exposed', applications: 2400, spend: 24000, lift: null },
  { region: 'Yorkshire', population: '5.5M', group: 'exposed', applications: 2200, spend: 22000, lift: null },
  { region: 'East of England', population: '6.3M', group: 'exposed', applications: 2600, spend: 26000, lift: null },
  { region: 'South West', population: '5.7M', group: 'exposed', applications: 2100, spend: 21000, lift: null },
  { region: 'East Midlands', population: '4.8M', group: 'exposed', applications: 1900, spend: 19000, lift: null },
  // Holdout regions (~20% of traffic)
  { region: 'North East', population: '2.7M', group: 'holdout', applications: 1100, spend: 0, lift: null },
  { region: 'Wales', population: '3.1M', group: 'holdout', applications: 900, spend: 0, lift: null },
  { region: 'Scotland', population: '5.5M', group: 'holdout', applications: 1800, spend: 0, lift: null },
];

// Simulated delivery data (for proposed test — shows expected pattern)
export const EXPECTED_DELIVERY = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  exposed: [280000, 310000, 295000, 315000],
  holdout: [85000, 92000, 88000, 90000],
};

// Previous incrementality benchmarks (industry data for reference)
export const INDUSTRY_BENCHMARKS = [
  { advertiser: 'UK Insurance Broker A', channel: 'PMAX', lift: '+12.3%', iROAS: '£1.82', testType: 'Geo holdout (4 weeks)', learning: 'PMAX cannibalised 40% of brand search volume' },
  { advertiser: 'UK Loan Comparison Site', channel: 'PMAX', lift: '+8.1%', iROAS: '£1.45', testType: 'Geo holdout (6 weeks)', learning: 'True incremental CPA was 2.4x platform-reported CPA' },
  { advertiser: 'UK Credit Card Provider', channel: 'Search (Generic)', lift: '+22.5%', iROAS: '£3.10', testType: 'Budget-based holdout', learning: 'Generic search drove genuine incremental applications' },
];

// Statistical confidence template (for when test runs)
export const STATISTICAL_CONFIDENCE = {
  exposedGroup: { n: 8, lift: 'TBD', confidence: 0, interval: 'TBD' },
  holdoutGroup: { n: 3, lift: 'Baseline', note: 'Organic + brand only (no PMAX)' },
  testResult: {
    significant: false,
    pValue: 'TBD',
    power: 'Target: 80%+',
    effectSize: 'Target: >5% lift',
    status: 'Not started',
  },
};

// Minimum detectable effect calculation
export const POWER_ANALYSIS = {
  baselineConversionRate: 0.032, // 3.2% application rate
  minimumDetectableEffect: 0.15, // 15% relative lift
  requiredSampleSize: 'est. 15,000 applications per group',
  testDuration: '4 weeks recommended',
  confidenceLevel: '95%',
  statisticalPower: '80%',
  note: 'Based on current PMAX daily volume (~190 applications/day) and 80/20 exposed/holdout split',
};
