import express, { type Request, type Response, type NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as auth from './auth.js';
import * as users from './users.js';
import db, { type User } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
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

// --- Auth Routes ---
app.get('/api/auth/status', (req: Request, res: Response) => {
  res.json({ setupNeeded: !auth.hasUsers() });
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

// --- Catch-all ---
app.use((req: Request, res: Response) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
