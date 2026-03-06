import express, { type Request, type Response, type NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as auth from './auth.js';
import * as users from './users.js';
import * as applications from './applications.js';
import * as settings from './settings.js';
import db, { type User } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS so the client on another port (e.g. Vite 5176) or origin can call the API
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if ((_req as any).method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json());

const port = process.env.PORT || 3000;
const clientBuildPath = path.join(__dirname, '../client/dist');

app.use(express.static(clientBuildPath));

// --- Middleware ---
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  const user = auth.verifyToken(token);
  if (!user) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  (req as any).user = user;
  next();
};

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    if ((req as any).user.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden: Admin access required' });
      return;
    }
    next();
  });
};

// API Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'NodePanelG API is running' });
});

// Dashboard stats (require auth)
app.get('/api/stats', requireAuth, (req: Request, res: Response) => {
  try {
    const userCount = (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c;
    const appCount = applications.getAllApplications().length;
    const runningCount = applications.getAllApplications().filter((a) => a.status === 'running').length;
    res.json({ userCount, appCount, runningCount });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Auth Routes ---
app.get('/api/auth/status', (req: Request, res: Response) => {
  try {
    res.json({ setupNeeded: !auth.hasUsers() });
  } catch (error: any) {
    console.error('Error checking auth status:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.post('/api/auth/setup', async (req: Request, res: Response) => {
  try {
    if (auth.hasUsers()) {
      res.status(400).json({ error: 'Setup already completed' });
      return;
    }
    const { email, password } = req.body;
    const user = await auth.createAdmin(email, password);
    const token = auth.generateToken(user);
    res.json({ user, token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    
    if (!user || !(await auth.comparePassword(password, user.password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const { password: _, ...userData } = user;
    const token = auth.generateToken(userData);
    res.json({ user: userData, token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }
    const user = await auth.registerUser(email, password);
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- User Management Routes ---
app.get('/api/users', requireAdmin, (req: Request, res: Response) => {
  try {
    res.json(users.getAllUsers());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string || '0');
    if (users.deleteUser(id)) {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Could not delete user' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Applications (require auth) ---
app.get('/api/apps', requireAuth, (req: Request, res: Response) => {
  try {
    res.json(applications.getAllApplications());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/apps', requireAuth, (req: Request, res: Response) => {
  try {
    const { name, port, scriptPath } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    const app = applications.createApplication({
      name: name.trim(),
      ...(port != null && port !== '' && { port: parseInt(String(port), 10) }),
      ...(typeof scriptPath === 'string' && scriptPath.trim() && { scriptPath: scriptPath.trim() }),
    });
    res.status(201).json(app);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/apps/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string || '0');
    const app = applications.getApplication(id);
    if (!app) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }
    const { name, status, port, scriptPath } = req.body;
    const updated = applications.updateApplication(id, {
      ...(name !== undefined && { name: String(name).trim() }),
      ...(status !== undefined && { status }),
      ...(port !== undefined && { port: port == null ? null : parseInt(String(port), 10) }),
      ...(scriptPath !== undefined && { scriptPath: scriptPath == null ? null : String(scriptPath) }),
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/apps/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string || '0');
    if (applications.deleteApplication(id)) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Application not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Settings (admin only) ---
app.get('/api/settings', requireAuth, (req: Request, res: Response) => {
  try {
    res.json(settings.getAllSettings());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/settings', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = settings.updateSettings(req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Catch-all ---
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// JSON 404 handler for /api routes
app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global JSON error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

const host = process.env.HOST || '0.0.0.0';
app.listen(port as number, host, () => {
  console.log(`[server]: Server is running at http://${host}:${port}`);
});
