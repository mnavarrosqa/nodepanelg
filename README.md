# NodePanelG

## Run the app

**Development** (one command, one URL):

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**. The API runs on port 3002 and is proxied automatically.  
If you get a 404 on create admin, the API may not be running — use `npm run dev` from the project root (it starts both the API and the client).

**Production**:

```bash
npm run build
npm start
```

Then open **http://localhost:3000** (or set `PORT` in the environment).

First time you run the app, you’ll be asked to create an admin account at `/setup`.
