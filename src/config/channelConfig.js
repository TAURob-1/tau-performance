// Channel definitions for performance marketing platforms
// Each channel defines available metrics, default KPIs, and data mapping

export const CHANNELS = {
  search: {
    label: 'Paid Search',
    platforms: ['google_ads', 'bing_ads'],
    primaryMetrics: ['cost', 'clicks', 'conversions', 'cpa', 'roas'],
    dimensions: ['campaign', 'adGroup', 'keyword', 'matchType', 'device'],
  },
  social: {
    label: 'Paid Social',
    platforms: ['meta_ads', 'tiktok_ads'],
    primaryMetrics: ['cost', 'impressions', 'reach', 'conversions', 'cpa', 'roas'],
    dimensions: ['campaign', 'adSet', 'ad', 'audience', 'placement'],
  },
};

export const KPI_CARDS = [
  { key: 'cost', label: 'Total Spend', format: 'currency', icon: '£' },
  { key: 'conversions', label: 'Conversions', format: 'number', icon: '#' },
  { key: 'roas', label: 'ROAS', format: 'ratio', icon: 'x' },
  { key: 'cpa', label: 'CPA', format: 'currency', icon: '£' },
];
