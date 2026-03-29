#!/usr/bin/env node
// Convert 247 CarFinance CSVs to JSON for tau-performance
import fs from 'node:fs';
import path from 'node:path';

const SOURCE_DIR = path.resolve('/home/r2/247_carfinance');
const OUT_DIR = path.resolve('src/data/clients/247cf');
const SKILLS_OUT = path.resolve('src/data/skills');

// Simple CSV parser handling quoted fields
function parseCSV(text) {
  const lines = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      lines.push(current);
      current = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      lines.push(current);
      current = '';
      // End of row marker
      lines.push('\n');
    } else {
      current += ch;
    }
  }
  if (current) lines.push(current);

  // Reconstruct rows from flat tokens
  const rows = [];
  let row = [];
  for (const token of lines) {
    if (token === '\n') {
      if (row.length > 0) rows.push(row);
      row = [];
    } else {
      row.push(token.trim());
    }
  }
  if (row.length > 0) rows.push(row);

  if (rows.length === 0) return [];

  const headers = rows[0];
  return rows.slice(1)
    .filter(r => r.length === headers.length && r.some(v => v !== ''))
    .map(r => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = r[i]; });
      return obj;
    });
}

function readCSV(filename) {
  const filepath = path.join(SOURCE_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`  SKIP: ${filename} not found`);
    return [];
  }
  const raw = fs.readFileSync(filepath, 'utf8');
  // Strip BOM
  const text = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;
  return parseCSV(text);
}

function writeJSON(filename, data) {
  const filepath = path.join(OUT_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`  -> ${filename} (${data.length} rows)`);
}

function num(v) {
  if (v === '' || v === undefined || v === null) return 0;
  const n = parseFloat(String(v).replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
}

// 1. Consolidated dataset
console.log('Converting consolidated dataset...');
const consolidated = readCSV('247_car_finance_consolidated_dataset.csv').map(r => ({
  date_start: r.date_start,
  date_end: r.date_end,
  channel: r.channel,
  campaign: r.campaign,
  ad_set: r.ad_set || '',
  ad: r.ad || '',
  campaign_type: r.campaign_type,
  status: r.status,
  cost_gbp: num(r.cost_gbp),
  impressions: num(r.impressions),
  clicks: num(r.clicks),
  orders: num(r.orders),
  revenue_gbp: num(r.revenue_gbp),
}));
writeJSON('consolidated.json', consolidated);

// 2. Meta Ad Sets
console.log('Converting Meta Ad Sets...');
const adsets = readCSV('CarFinance-247-Premier-Ad-sets-1-Jan-2026-6-Mar-2026.csv').map(r => ({
  reporting_starts: r['Reporting starts'],
  reporting_ends: r['Reporting ends'],
  name: r['Ad set name'],
  delivery: r['Ad set delivery'],
  results: num(r['Results']),
  result_indicator: r['Result indicator'],
  cpa: num(r['Cost per results']),
  budget: num(r['Ad set budget']),
  budget_type: r['Ad set budget type'],
  spend: num(r['Amount spent (GBP)']),
  impressions: num(r['Impressions']),
  reach: num(r['Reach']),
  starts: r['Starts'] || '',
  attribution: r['Attribution setting'],
  cpm: num(r['CPM (cost per 1,000 impressions) (GBP)']),
  frequency: num(r['Frequency']),
  link_clicks: num(r['Link clicks']),
}));
writeJSON('meta-adsets.json', adsets);

// 3. Meta Ads
console.log('Converting Meta Ads...');
const ads = readCSV('CarFinance-247-Premier-Ads-1-Jan-2026-6-Mar-2026.csv').map(r => ({
  reporting_starts: r['Reporting starts'],
  reporting_ends: r['Reporting ends'],
  name: r['Ad name'],
  delivery: r['Ad delivery'],
  results: num(r['Results']),
  result_indicator: r['Result indicator'],
  cpa: num(r['Cost per results']),
  spend: num(r['Amount spent (GBP)']),
  impressions: num(r['Impressions']),
  reach: num(r['Reach']),
  quality_ranking: r['Quality ranking'] || '',
  engagement_ranking: r['Engagement rate ranking'] || '',
  conversion_ranking: r['Conversion rate ranking'] || '',
  ad_set_name: r['Ad set name'] || '',
  cpm: num(r['CPM (cost per 1,000 impressions) (GBP)']),
  frequency: num(r['Frequency']),
  link_clicks: num(r['Link clicks']),
}));
writeJSON('meta-ads.json', ads);

// 4. Meta Age breakdown
console.log('Converting Meta Age breakdown...');
const age = readCSV('CarFinance-247-Premier-Campaigns-Age-1-Jan-2026-6-Mar-2026.csv').map(r => ({
  campaign: r['Campaign name'],
  age: r['Age'],
  delivery: r['Campaign delivery'],
  results: num(r['Results']),
  cpa: num(r['Cost per results']),
  spend: num(r['Amount spent (GBP)']),
  impressions: num(r['Impressions']),
  reach: num(r['Reach']),
  cpm: num(r['CPM (cost per 1,000 impressions) (GBP)']),
  frequency: num(r['Frequency']),
  link_clicks: num(r['Link clicks']),
}));
writeJSON('meta-age.json', age);

// 5. Meta Gender breakdown
console.log('Converting Meta Gender breakdown...');
const gender = readCSV('CarFinance-247-Premier-Campaigns-Gender-1-Jan-2026-6-Mar-2026.csv').map(r => ({
  campaign: r['Campaign name'],
  gender: r['Gender'],
  delivery: r['Campaign delivery'],
  results: num(r['Results']),
  cpa: num(r['Cost per results']),
  spend: num(r['Amount spent (GBP)']),
  impressions: num(r['Impressions']),
  reach: num(r['Reach']),
  cpm: num(r['CPM (cost per 1,000 impressions) (GBP)']),
  frequency: num(r['Frequency']),
  link_clicks: num(r['Link clicks']),
}));
writeJSON('meta-gender.json', gender);

// 6. Meta Placement breakdown
console.log('Converting Meta Placement breakdown...');
const placement = readCSV('CarFinance-247-Premier-Campaigns- Placement1-Jan-2026-6-Mar-2026.csv').map(r => ({
  campaign: r['Campaign name'],
  platform: r['Platform'],
  placement: r['Placement'],
  device: r['Device platform'] || '',
  delivery: r['Campaign delivery'],
  results: num(r['Results']),
  cpa: num(r['Cost per results']),
  spend: num(r['Amount spent (GBP)']),
  impressions: num(r['Impressions']),
  reach: num(r['Reach']),
  cpm: num(r['CPM (cost per 1,000 impressions) (GBP)']),
  frequency: num(r['Frequency']),
  link_clicks: num(r['Link clicks']),
}));
writeJSON('meta-placement.json', placement);

// 7. Copy performance machine MD
console.log('Copying performance-machine.md...');
const pmSource = path.join(SOURCE_DIR, '247_performance_machine.md');
if (fs.existsSync(pmSource)) {
  fs.copyFileSync(pmSource, path.join(OUT_DIR, 'performance-machine.md'));
  console.log('  -> performance-machine.md copied');
}

// 8. Concatenate TAU Skills into skills-context.md
console.log('Building skills-context.md...');
const SKILLS_DIR = '/home/r2/TAU_Skills';
const skillFiles = [
  { name: 'Paid Search', path: 'channel/paid-search/SKILL.md' },
  { name: 'Meta Social', path: 'channel/meta-social/SKILL.md' },
  { name: 'Attribution Diagnostic', path: 'client/attribution-diagnostic/SKILL.md' },
  { name: 'Channel Approach', path: 'planning/channel-approach/SKILL.md' },
  { name: 'Search', path: 'channel/search/SKILL.md' },
  { name: 'Social', path: 'channel/social/SKILL.md' },
];

let skillsContent = '';
for (const skill of skillFiles) {
  const fp = path.join(SKILLS_DIR, skill.path);
  if (fs.existsSync(fp)) {
    const content = fs.readFileSync(fp, 'utf8');
    skillsContent += `\n\n[TAU Skills — ${skill.name}]\n${content}\n`;
    console.log(`  + ${skill.name} (${content.split('\n').length} lines)`);
  } else {
    console.warn(`  SKIP: ${skill.path} not found`);
  }
}
fs.writeFileSync(path.join(SKILLS_OUT, 'skills-context.md'), skillsContent.trim());
console.log('  -> skills-context.md written');

console.log('\nDone!');
