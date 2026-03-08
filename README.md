# PDF Platform

## ⚡ Quick Start (3 commands)

```bash
# 1. Install all dependencies
cd web && npm install && cd ../api && npm install && cd ../worker && npm install && cd ..

# 2. Start Redis (required)
redis-server --daemonize yes

# 3. Start everything
bash scripts/start-dev.sh
```

Then open: **http://localhost:3000**

---

## Folder Structure

```
pdf-platform/           ← YOU ARE HERE (project root)
├── web/                ← Next.js frontend  → runs on :3000
├── api/                ← NestJS API        → runs on :3001
├── worker/             ← BullMQ worker
├── shared/             ← Shared types/SDK
├── scripts/            ← Dev startup scripts
└── storage/            ← File storage (auto-created)
```

## Start Each Service Individually

```bash
# Web (Next.js) — from project ROOT
cd web && npm install && npm run dev

# API (NestJS) — from project ROOT
cd api && npm install && npm run start:dev

# Worker — from project ROOT
cd worker && npm install && npm run start:dev
```

## System Requirements

```bash
# Ubuntu/Debian
sudo apt install redis-server qpdf ghostscript imagemagick

# macOS
brew install redis qpdf ghostscript imagemagick
```

## ❌ Common Mistakes

| Wrong | Correct |
|-------|---------|
| `cd apps/web && npm run dev` | `cd web && npm run dev` |
| `npm run dev:web` from inside `web/` | Run from **project root**: `cd web && npm run dev` |
| `npm run start:web` | `cd web && npm run dev` |

> **There is no `apps/` folder.** The structure is `web/`, `api/`, `worker/` directly inside the project root.

```
git add .                                     
git commit -m "fix: replace hardcoded localhost with production API URL"
git push
```
