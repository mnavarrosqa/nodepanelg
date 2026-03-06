import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the React app
// Adjust path to point to client/dist relative to where this file is running (src or dist)
// In dev: src/index.ts -> ../client/dist
// In prod: dist/index.js -> ../client/dist (if dist is sibling to client)
const clientBuildPath = path.join(__dirname, '../client/dist');

app.use(express.static(clientBuildPath));

// API routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'NodePanelG API is running' });
});

// Catch-all handler to serve index.html for any request that doesn't match an API route
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  console.log(`[server]: Serving client from ${clientBuildPath}`);
});
