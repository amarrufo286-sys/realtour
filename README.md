# RealTour — MERN Monorepo (client + server)

> One repo with two folders: `client/` (React) and `server/` (Node/Express). This README explains how to set up, run, and troubleshoot locally—especially on Windows/PowerShell.

## Folder Structure
```
realtour/
  client/   # React app (Vite or CRA)
  server/   # Node/Express API
  README.md
```
> Tip: Always run commands **inside the right folder** (`client` vs `server`).

---

## Prerequisites
- **Node.js**: v18 or newer (LTS recommended)  
  Check: `node -v`
- **npm**: v10+ recommended  
  Check: `npm -v` (update with `npm install -g npm@latest` if needed)
- **MongoDB**: Local instance or a cloud connection string (e.g., MongoDB Atlas)

---

## Quick Start (Local, Two Terminals)
1) **Clone & enter the repo**
```bash
git clone <your repo url>
cd realtour
```

2) **Install dependencies (run in each folder once)**
- **Windows PowerShell**
  ```powershell
  cd client
  npm install
  cd ../server
  npm install
  cd ..
  ```

- **macOS/Linux**
  ```bash
  (cd client && npm install)
  (cd server && npm install)
  ```

3) **Create environment files**
- **server/.env**
  ```env
  # example values — replace with your real ones
  PORT=5000
  MONGO_URI=mongodb://127.0.0.1:27017/realtour
  JWT_SECRET=change_me
  ```

- **client/.env** (for **Vite**)
  ```env
  VITE_API_BASE_URL=http://localhost:5000
  ```
  *(If using Create React App instead of Vite: `REACT_APP_API_BASE_URL=http://localhost:5000`)*

4) **Run the backend (Terminal A)**
```powershell
cd server
# Pick the script that exists in package.json:
#   npm run dev   (if using nodemon)
#   npm start     (if dev doesn't exist)
npm run dev
```

5) **Run the frontend (Terminal B)**
```powershell
cd client
# Vite projects usually use:
#   npm run dev   -> opens http://localhost:5173
# CRA projects usually use:
#   npm start     -> opens http://localhost:3000
npm run dev
```

> If you’re not sure which script exists, run `npm run` inside each folder to list available scripts.

---

## One-Command Start (Optional, from repo root)
Add this to **root** `package.json` (create it if missing):
```json
{
  "name": "realtour-root",
  "private": true,
  "scripts": {
    "install:all": "npm --prefix client install && npm --prefix server install",
    "dev": "concurrently \"npm --prefix server run dev\" \"npm --prefix client run dev\""
  },
  "devDependencies": {
    "concurrently": "^9.0.0"
  }
}
```
Then run:
```bash
npm install
npm run dev
```
This will start **server** and **client** at the same time.

---

## Cleaning Installs (when things act weird)
**Do _not_ use `rm -rf` in PowerShell.** Use the correct Windows command:

**Windows PowerShell**
```powershell
# In client
cd client
Remove-Item -Recurse -Force node_modules
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }
npm install

# In server
cd ../server
Remove-Item -Recurse -Force node_modules
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }
npm install
```

**macOS/Linux**
```bash
rm -rf client/node_modules client/package-lock.json
rm -rf server/node_modules server/package-lock.json
(cd client && npm install)
(cd server && npm install)
```

---

## Common Script Setup (if scripts are missing)
If `npm run dev` says “Missing script: dev”, add these to the respective `package.json`:

**server/package.json**
```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "mongoose": "^7.6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```
> If your entry file is `index.js` instead of `server.js`, update the script accordingly.

**client/package.json**
- For **Vite**:
  ```json
  {
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
    }
  }
  ```

- For **Create React App**:
  ```json
  {
    "scripts": {
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test",
      "eject": "react-scripts eject"
    }
  }
  ```

---

## Troubleshooting Cheatsheet

### 1) PowerShell says: `A parameter cannot be found that matches parameter name 'rf'`
- Cause: `rm -rf` is a **bash** command, not PowerShell.
- Fix: Use `Remove-Item -Recurse -Force node_modules` in PowerShell.

### 2) `npm error Missing script: "dev"`
- Run `npm run` inside `client` or `server` to see what scripts exist.
- If missing, add the scripts shown in **Common Script Setup** above.

### 3) Path errors like: `Cannot find path ...\server\server` or `...\server\client`
- You probably ran `cd server` and then tried `cd server` again (now looking for `server/server`).  
- Solution: Open **two terminals**:
  - Terminal A stays in `realtour/server` → run backend
  - Terminal B stays in `realtour/client` → run frontend

### 4) React fails to start or shows a white page
- Check Node version: must be **>= 18**
- Delete `node_modules` + `package-lock.json`, then reinstall
- Vite needs the **VITE_** prefix for env vars (e.g., `VITE_API_BASE_URL`)
- CRA needs the **REACT_APP_** prefix
- Ensure the port isn’t in use (5173 for Vite, 3000 for CRA). Kill stray processes or change the port.

### 5) Backend won’t connect to MongoDB
- Verify `server/.env` is loaded and `MONGO_URI` is correct.
- If using Atlas, whitelist your IP or use `0.0.0.0/0` during development.
- Log connection errors in `server.js` and fail fast if missing env vars.

### 6) CORS / API Base URL issues
- In the server, enable CORS:
  ```js
  import cors from "cors";
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  ```
- In the client, use the env var base URL consistently:
  ```js
  const api = import.meta.env.VITE_API_BASE_URL; // Vite
  // or process.env.REACT_APP_API_BASE_URL for CRA
  ```

### 7) Ports
- Typical defaults:
  - Vite: **5173**
  - CRA: **3000**
  - Server: **5000**
- If you change any, update your env vars and CORS settings.

---

## What to Ask a Collaborator Who Reports an Error
Ask them to send:
1. **Exact error output** from the terminal (copy/paste or screenshot).
2. **Node and npm versions**:
   ```bash
   node -v
   npm -v
   ```
3. **Which folder they ran the command in** (`client` vs `server`).
4. **Whether they ran `npm install`** in **both** `client` and `server`.
5. Output of `npm run` in each folder (to see available scripts).

---

## Git Hygiene
- Do **not** commit:
  - `node_modules`
  - `.env` files
  - build artifacts (`dist/`, `build/`)
- Ensure `.gitignore` includes:
  ```gitignore
  node_modules/
  .env
  dist/
  build/
  ```

---

## FAQ
**Q: Vite vs CRA — which do we use?**  
A: Check `client/package.json` scripts. If you see `vite`, it’s Vite. If you see `react-scripts`, it’s CRA.

**Q: How do I change the API base URL?**  
A: Set in `client/.env` as `VITE_API_BASE_URL` (Vite) or `REACT_APP_API_BASE_URL` (CRA) and restart the dev server.

**Q: Can I run both with one command?**  
A: Yes—use the root `concurrently` setup shown above.
