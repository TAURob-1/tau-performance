export const CLIENT_OPTIONS = [
  {
    id: '247cf',
    name: '247 CarFinance',
    slug: '247cf',
    vertical: 'car finance',
    features: ['search', 'social', 'pricing'],
    branding: {
      gradient: 'from-[#1a365d] to-[#2b6cb0]',
      accent: '#2b6cb0',
      accentHover: '#3182ce',
    },
  },
];

export const CHANNEL_CONFIG = {
  google_ads: {
    id: 'google_ads',
    name: 'Google Ads',
    type: 'search',
    icon: 'G',
    color: '#4285F4',
    metrics: ['impressions', 'clicks', 'ctr', 'cpc', 'cost', 'conversions', 'convRate', 'cpa', 'roas'],
  },
  meta_ads: {
    id: 'meta_ads',
    name: 'Meta Ads',
    type: 'social',
    icon: 'M',
    color: '#1877F2',
    metrics: ['impressions', 'reach', 'clicks', 'ctr', 'cpc', 'cost', 'conversions', 'cpa', 'roas', 'frequency'],
  },
  bing_ads: {
    id: 'bing_ads',
    name: 'Microsoft Ads',
    type: 'search',
    icon: 'B',
    color: '#00A4EF',
    metrics: ['impressions', 'clicks', 'ctr', 'cpc', 'cost', 'conversions', 'convRate', 'cpa'],
  },
  tiktok_ads: {
    id: 'tiktok_ads',
    name: 'TikTok Ads',
    type: 'social',
    icon: 'T',
    color: '#000000',
    metrics: ['impressions', 'reach', 'clicks', 'ctr', 'cpc', 'cost', 'conversions', 'cpa', 'videoViews'],
  },
};

export const METRIC_DEFINITIONS = {
  impressions: { label: 'Impressions', format: 'number' },
  reach: { label: 'Reach', format: 'number' },
  clicks: { label: 'Clicks', format: 'number' },
  ctr: { label: 'CTR', format: 'percent' },
  cpc: { label: 'CPC', format: 'currency' },
  cost: { label: 'Spend', format: 'currency' },
  conversions: { label: 'Conversions', format: 'number' },
  convRate: { label: 'Conv. Rate', format: 'percent' },
  cpa: { label: 'CPA', format: 'currency' },
  roas: { label: 'ROAS', format: 'ratio' },
  revenue: { label: 'Revenue', format: 'currency' },
  frequency: { label: 'Frequency', format: 'decimal' },
  videoViews: { label: 'Video Views', format: 'number' },
};

export const PLATFORM_BRAND = {
  name: 'TAU Performance',
  product: 'Performance Marketing Dashboard',
};
