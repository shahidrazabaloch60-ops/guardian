import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from api folder first, then root as fallback
dotenv.config(); // loads apps/api/.env
dotenv.config({ path: path.join(__dirname, '../../../.env') }); // loads root .env

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3005',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3005',
  'http://127.0.0.1:3001',
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean) as string[];

const app: express.Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  },
});

// Middleware Stack
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(hpp());

// Health Check API
app.get('/health', (req, res) => {
  res.json({ success: true, status: 'healthy', timestamp: new Date().toISOString() });
});

import { ChatController } from './controllers/chat.controller';

// Chat API Routes (In production these should be protected by auth middleware)
app.get('/api/chat/sessions', ChatController.getActiveSessions);
app.get('/api/chat/sessions/:sessionId/messages', ChatController.getSessionMessages);
app.get('/api/chat/visitors', ChatController.getActiveVisitors);
app.get('/api/chat/leads', ChatController.getLeads);
app.delete('/api/chat/sessions/:sessionId', ChatController.deleteSession);

import { SocketService } from './services/socket.service';

// Socket.io Real-time Chat implementation
new SocketService(io);

import { prisma } from './lib/prisma';

// Automatically migrate any legacy AI_HANDLING sessions to the human queue
prisma.chatSession.updateMany({
  where: { status: 'AI_HANDLING' },
  data: { status: 'WAITING_FOR_AGENT' }
}).then((res: any) => {
  if (res.count > 0) {
    console.log(`[GuardianRS API] Migrated ${res.count} legacy AI sessions to WAITING_FOR_AGENT.`);
  }
}).catch((err: any) => console.error('[Startup Migration Error]', err));

// Seed default site settings if they don't exist
const defaultBadges = [
  { title: 'VPN Regional Protection', icon: '🛡️', desc: 'We match your local region IP' },
  { title: '100% Hand Done', icon: '💪', desc: 'No bots or macro automation ever' },
  { title: 'Professional Boosters', icon: '⭐', desc: 'Fully vetted elite OSRS players' },
  { title: '24/7 Live Support', icon: '💬', desc: 'Here to help you anytime' }
];

prisma.siteSetting.findUnique({ where: { key: 'trust_badges' } }).then(async (setting: any) => {
  if (!setting) {
    await prisma.siteSetting.create({
      data: {
        key: 'trust_badges',
        value: JSON.stringify(defaultBadges),
        type: 'JSON'
      }
    });
    console.log('[GuardianRS API] Seeded default trust badges setting.');
  }
}).catch((err: any) => console.error('[Startup Settings Seed Error]', err));

// Settings Routes
app.get('/api/settings/trust-badges', async (req, res) => {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'trust_badges' } });
    if (setting) {
      res.json(JSON.parse(setting.value));
    } else {
      res.json(defaultBadges);
    }
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch trust badges' });
  }
});

app.post('/api/settings/trust-badges', async (req, res) => {
  try {
    const { badges } = req.body;
    if (!Array.isArray(badges)) {
      return res.status(400).json({ error: 'Invalid badges array' });
    }
    await prisma.siteSetting.upsert({
      where: { key: 'trust_badges' },
      update: { value: JSON.stringify(badges) },
      create: {
        key: 'trust_badges',
        value: JSON.stringify(badges),
        type: 'JSON'
      }
    });
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

const defaultAnnouncement = {
  isActive: true,
  badgeText: 'LIVE ALERT',
  title: 'COLOSSEUM SERVICES NOW ACTIVE',
  description: "Secure your Dizana's Quiver with 100% hand-done, VPN-protected boosts.",
  button1Text: 'Consult Expert',
  button2Text: 'Colosseum Pricing',
  button2Url: '/bossing/colosseum',
  button3Text: 'Quest Catalog',
  button3Url: '/quests'
};

// Force update seed in development to sync theme changes
prisma.siteSetting.upsert({
  where: { key: 'hero_announcement' },
  update: { value: JSON.stringify(defaultAnnouncement) },
  create: {
    key: 'hero_announcement',
    value: JSON.stringify(defaultAnnouncement),
    type: 'JSON'
  }
}).then(() => {
  console.log('[GuardianRS API] Seeded/Updated default hero announcement setting.');
}).catch((err: any) => console.error('[Startup Settings Announcement Seed Error]', err));

app.get('/api/settings/hero-announcement', async (req, res) => {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'hero_announcement' } });
    if (setting) {
      res.json(JSON.parse(setting.value));
    } else {
      res.json(defaultAnnouncement);
    }
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch hero announcement' });
  }
});

app.post('/api/settings/hero-announcement', async (req, res) => {
  try {
    const { announcement } = req.body;
    if (!announcement || typeof announcement !== 'object') {
      return res.status(400).json({ error: 'Invalid announcement object' });
    }
    await prisma.siteSetting.upsert({
      where: { key: 'hero_announcement' },
      update: { value: JSON.stringify(announcement) },
      create: {
        key: 'hero_announcement',
        value: JSON.stringify(announcement),
        type: 'JSON'
      }
    });
    res.json({ success: true, message: 'Hero announcement updated successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update hero announcement' });
  }
});

const defaultWelcomeMessage = "👋 Hi! Welcome to our OSRS boosting service. How can I help you today?";

prisma.siteSetting.findUnique({ where: { key: 'chat_welcome_message' } }).then(async (setting: any) => {
  if (!setting) {
    await prisma.siteSetting.create({
      data: {
        key: 'chat_welcome_message',
        value: defaultWelcomeMessage,
        type: 'STRING'
      }
    });
    console.log('[GuardianRS API] Seeded default chat welcome message setting.');
  }
}).catch((err: any) => console.error('[Startup Settings Welcome Message Seed Error]', err));

app.get('/api/settings/chat-welcome-message', async (req, res) => {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'chat_welcome_message' } });
    res.json({ message: setting ? setting.value : defaultWelcomeMessage });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch welcome message' });
  }
});

app.post('/api/settings/chat-welcome-message', async (req, res) => {
  try {
    const { message } = req.body;
    if (typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message string' });
    }
    await prisma.siteSetting.upsert({
      where: { key: 'chat_welcome_message' },
      update: { value: message },
      create: {
        key: 'chat_welcome_message',
        value: message,
        type: 'STRING'
      }
    });
    res.json({ success: true, message: 'Welcome message updated successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update welcome message' });
  }
});

import * as functions from 'firebase-functions';

const PORT = process.env.PORT || 3001;

// Only start local web server in non-production/non-serverless local environments
if (!process.env.FIREBASE_CONFIG && process.env.NODE_ENV !== 'production') {
  httpServer.listen(PORT, () => {
    console.log(`[GuardianRS API] Server running on port ${PORT}`);
  });
}

// Low-level request handler mapping for Socket.io traffic inside Cloud Functions
app.all('/socket.io/*', (req, res) => {
  io.engine.handleRequest(req, res);
});

// Export Firebase Cloud Functions HTTPS handler
export const api = functions.https.onRequest((req, res) => {
  app(req, res);
});

export { app, httpServer, io };
