// Hardcoded performance machine data — extracted for reuse and future API migration

export const BUDGET_LIMITED_CAMPAIGNS = [
  { campaign: 'UK_GN_Bad_Credit_Exact', budget: 3800, spend: 240786, orders: 6693, cpa: 35.95, recommendation: 'Increase to £5,500/day (+30-40% volume)', priority: 'HIGH' },
  { campaign: 'UK_GN_Performance_Max_Bad_Credit', budget: 4200, spend: 247955, orders: 12359, cpa: 20.06, recommendation: 'Policy-restricted — resolve financial services verification first', priority: 'MEDIUM' },
  { campaign: 'UK_GN_Bad_Credit_Poor_Credit_TP_Exact', budget: 2000, spend: 62280, orders: 1423, cpa: 43.75, recommendation: 'Test incremental volume at £2,500/day', priority: 'MEDIUM' },
];

export const CONVERSION_ACTIONS = [
  { name: 'Application', type: 'Primary', status: 'active', events: '32,000+', signal: 'HIGH', note: 'Only meaningful conversion action' },
  { name: 'App Installs', type: 'Secondary', status: 'active', events: '~500', signal: 'LOW', note: 'Noise — not primary KPI' },
  { name: 'Clicks to call', type: 'Secondary', status: 'active', events: '~2,000', signal: 'MEDIUM', note: 'Phone leads — needs call tracking' },
  { name: 'Local actions', type: 'Secondary', status: 'active', events: '~300', signal: 'LOW', note: 'Store visits — limited signal' },
  { name: 'MC Floodlights', type: 'Legacy', status: 'active', events: '~1,000', signal: 'NOISE', note: 'Dual-tracking SA360 — remove' },
  { name: 'SA360 conversions', type: 'Legacy', status: 'active', events: '~1,500', signal: 'NOISE', note: 'Dual-tracking with MID — consolidate' },
  { name: 'TEST floodlights', type: 'Test', status: 'active', events: '<100', signal: 'NOISE', note: 'Test tags still live — disable' },
];

export const PMAX_DIAGNOSTICS = [
  { label: 'Brand negatives applied', status: 'red', note: 'Not confirmed — PMAX may be cannibalising brand' },
  { label: 'Asset groups by intent', status: 'amber', note: 'Single asset group — no intent separation' },
  { label: 'Incrementality test', status: 'red', note: 'No geo holdout test running' },
  { label: 'Financial services verification', status: 'red', note: 'All asset groups policy-restricted' },
  { label: 'URL exclusions', status: 'amber', note: 'Not confirmed' },
];

export const CAPI_EVENTS = [
  { event: 'PageView', status: 'green', integration: 'Meta Pixel', emq: '—', events: '376K', duplicates: '—', note: 'Active' },
  { event: 'Submit Application', status: 'amber', integration: 'Pixel + CAPI', emq: '7.4/10', events: '17.3K', duplicates: '50%+', note: '1 warning — dedup broken' },
  { event: 'Lead', status: 'amber', integration: 'Pixel + CAPI', emq: '7.4/10', events: '17.3K', duplicates: '50%+', note: '1 warning — mirrors Submit Application' },
  { event: 'Add to Wishlist', status: 'green', integration: 'CAPI only', emq: '6.7/10', events: '55.4K', duplicates: '—', note: '1 ad set using' },
  { event: 'View Content', status: 'amber', integration: 'CAPI only', emq: '6.9/10', events: '9.5K', duplicates: '—', note: '1 warning' },
  { event: 'Customer Approval', status: 'green', integration: 'CAPI only', emq: '8.0/10', events: '5.6K', duplicates: '—', note: 'Best EMQ score' },
  { event: 'Valuation Submitted', status: 'red', integration: 'CAPI only', emq: '—', events: '74', duplicates: '—', note: 'No recent activity' },
];

export const MESSAGING_THEMES = [
  { theme: 'Zero deposit', ads: 8, spend: '£120K+', cpa: '£15-18', status: 'Active', grade: 'B+' },
  { theme: 'Bad credit accepted', ads: 12, spend: '£95K+', cpa: '£14-22', status: 'Active', grade: 'B' },
  { theme: 'Trustpilot social proof', ads: 6, spend: '£189K+', cpa: '£15-16', status: 'Active — top performer', grade: 'A' },
  { theme: 'Monthly payment framing', ads: 0, spend: '—', cpa: '—', status: 'NOT PRESENT', grade: '—' },
  { theme: 'No impact on credit score', ads: 0, spend: '—', cpa: '—', status: 'NOT PRESENT', grade: '—' },
  { theme: 'Decision in 60 seconds', ads: 0, spend: '—', cpa: '—', status: 'NOT PRESENT', grade: '—' },
  { theme: 'CCJ / self-employed specific', ads: 0, spend: '—', cpa: '—', status: 'NOT PRESENT', grade: '—' },
  { theme: 'Customer testimonial (UGC)', ads: 5, spend: '£25K+', cpa: '£18-130', status: 'Active — mixed results', grade: 'C' },
  { theme: 'Vehicle collage imagery', ads: 10, spend: '£80K+', cpa: '£16-20', status: 'Active', grade: 'B' },
  { theme: '500K customers milestone', ads: 2, spend: '£8K', cpa: '£22+', status: 'Active — underperforming', grade: 'C-' },
];

export const ATTRIBUTION_SETTINGS = [
  { setting: '7-day click, 1-day view', count: 8, status: 'Recommended', ok: true },
  { setting: 'Multiple attribution settings', count: 4, status: 'Inconsistent — standardise', ok: false },
];

export const INCREMENTALITY_PLACEHOLDER = '90pc pc or 1r pc post view';

export const INCREMENTALITY_EXPERIMENTS = {
  googleAds: {
    platform: 'Google Ads',
    source: 'Google Ads experiments / conversion lift',
    status: 'placeholder',
    statusLabel: 'API pending',
    methodology: 'Platform-native lift study or geo holdout',
    counterfactual: 'Exposed vs holdout regions/users',
    placeholder: INCREMENTALITY_PLACEHOLDER,
    apiState: 'No experiment endpoint wired yet',
    note: 'Mirror the geo-test reporting model once Google Ads experiment data is available. Until then, treat platform-reported PMAX efficiency as directional, not incremental truth.',
  },
  meta: {
    platform: 'Meta',
    source: 'Meta Experiments / Conversion Lift',
    status: 'placeholder',
    statusLabel: 'API pending',
    methodology: 'Conversion lift or geo holdout',
    counterfactual: 'Exposed vs control audience',
    placeholder: INCREMENTALITY_PLACEHOLDER,
    apiState: 'No experiments API wired yet',
    note: 'Meta self-reported performance is not incremental ROAS. Keep prospecting vs retargeting split, then calibrate with lift studies or holdouts when experiment data is accessible.',
  },
};
