// TAU Performance API Server
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import 'dotenv/config';
import fs from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const app = express();
const PORT = process.env.PORT || 5181;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;
const SESSION_SECRET = process.env.SESSION_SECRET || 'tau-performance-secret-change-in-production';

// Users database
const USERS = {
  'TAU': { password: 'Demo2026', access: 'full' },
  '247CF': { password: '247CF2026', access: '247cf-only' },
};

const CLIENT_CONFIGS = {
  '247cf': {
    name: '247 CarFinance',
    slug: '247cf',
    vertical: 'car finance',
    features: ['search', 'social', 'pricing'],
    context: 'You are working with 247 CarFinance data. They are a UK subprime car finance broker. Focus on search and social performance marketing plus pricing/elasticity analysis.',
  },
};

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  req.session.user = { username, access: user.access };
  res.json({ success: true, user: { username, access: user.access } });
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Current user
app.get('/api/user', (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user: req.session.user });
});

// Client config
app.get('/api/clients', requireAuth, (req, res) => {
  const userAccess = req.session.user.access;
  if (userAccess === 'full') {
    return res.json({ clients: Object.values(CLIENT_CONFIGS) });
  }
  const clientSlug = userAccess.replace('-only', '');
  const client = CLIENT_CONFIGS[clientSlug];
  return res.json({ clients: client ? [client] : [] });
});

// --- Data directory ---
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const DATA_DIR = path.join(__dirname, 'src', 'data', 'clients', '247cf');

// Preload JSON data files
function loadJSON(filename) {
  const filepath = path.join(DATA_DIR, filename);
  if (!existsSync(filepath)) return [];
  try {
    return JSON.parse(readFileSync(filepath, 'utf8'));
  } catch { return []; }
}

const consolidatedData = loadJSON('consolidated.json');
const crmData = loadJSON('crm.json');
const metaAdsetsData = loadJSON('meta-adsets.json');
const metaAdsData = loadJSON('meta-ads.json');
const metaAgeData = loadJSON('meta-age.json');
const metaGenderData = loadJSON('meta-gender.json');
const metaPlacementData = loadJSON('meta-placement.json');

console.log(`Data loaded: ${consolidatedData.length} consolidated, ${metaAdsetsData.length} ad sets, ${metaAdsData.length} ads`);

// Preload context files
let performanceMachine = '';
let skillsContext = '';

const pmPath = path.join(DATA_DIR, 'performance-machine.md');
if (existsSync(pmPath)) {
  performanceMachine = readFileSync(pmPath, 'utf8');
  console.log(`Performance machine: ${performanceMachine.split('\n').length} lines`);
}

const skillsPath = path.join(__dirname, 'src', 'data', 'skills', 'skills-context.md');
if (existsSync(skillsPath)) {
  skillsContext = readFileSync(skillsPath, 'utf8');
  console.log(`Skills context: ${skillsContext.split('\n').length} lines`);
}

// --- Consolidated data endpoint ---
app.get('/api/data/247cf', requireAuth, (req, res) => {
  const userAccess = req.session.user.access;
  if (userAccess !== 'full' && userAccess !== '247cf-only') {
    return res.status(403).json({ error: 'Access denied' });
  }
  res.json(consolidatedData);
});
app.get('/api/data/247cf/crm', requireAuth, (req, res) => res.json(crmData));

// Meta breakdown endpoints
app.get('/api/data/247cf/meta-adsets', requireAuth, (req, res) => res.json(metaAdsetsData));
app.get('/api/data/247cf/meta-ads', requireAuth, (req, res) => res.json(metaAdsData));
app.get('/api/data/247cf/meta-age', requireAuth, (req, res) => res.json(metaAgeData));
app.get('/api/data/247cf/meta-gender', requireAuth, (req, res) => res.json(metaGenderData));
app.get('/api/data/247cf/meta-placement', requireAuth, (req, res) => res.json(metaPlacementData));

// --- Context endpoint for chat ---
app.get('/api/context/247cf', requireAuth, (req, res) => {
  res.json({
    performanceMachine,
    performanceMachineLines: performanceMachine.split('\n').length,
    skills: skillsContext,
    skillsLines: skillsContext.split('\n').length,
  });
});

// --- Legacy per-channel data endpoint (kept for compatibility) ---
app.get('/api/data/:client/:channel', requireAuth, async (req, res) => {
  const client = String(req.params.client).toLowerCase().replace(/[^a-z0-9-]/g, '');
  const channel = String(req.params.channel).toLowerCase().replace(/[^a-z0-9-]/g, '');

  const userAccess = req.session.user.access;
  if (userAccess !== 'full' && userAccess !== `${client}-only`) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const dataDir = path.join(__dirname, 'src', 'data', 'clients', client, channel);
  try {
    const files = await fs.readdir(dataDir).catch(() => []);
    if (files.length === 0) {
      return res.json({ client, channel, data: [], files: [] });
    }

    const result = { client, channel, files: [] };
    const allData = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const raw = await fs.readFile(path.join(dataDir, file), 'utf8');
          const parsed = JSON.parse(raw);
          result.files.push(file);
          if (Array.isArray(parsed)) {
            allData.push(...parsed);
          } else {
            allData.push(parsed);
          }
        } catch { /* skip malformed */ }
      }
    }

    result.data = allData;
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load data', details: error.message });
  }
});

// Chat proxy
app.post('/api/chat', requireAuth, async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const userAccess = req.session.user.access;
    const requestBody = { ...req.body };

    // Inject client context
    const clientSlug = userAccess === 'full' ? '247cf' : userAccess.replace('-only', '');
    const clientConfig = CLIENT_CONFIGS[clientSlug];
    if (clientConfig?.context) {
      requestBody.system = (requestBody.system || '') + '\n\n' + clientConfig.context;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Anthropic API error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[Chat Proxy] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from dist
const distPath = path.join(__dirname, 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  console.log('Static files served from dist/');
} else {
  console.log('No dist/ folder — use vite dev server');
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TAU Performance API running on port ${PORT}`);
  console.log(`  API key: ${ANTHROPIC_API_KEY ? 'YES' : 'NO'}`);
  console.log(`  Users: ${Object.keys(USERS).length}`);
});
