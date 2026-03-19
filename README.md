# 🍔 Slooze Eats — Modern Food Delivery Platform

A high-performance, full-stack monorepo food delivery application built with **Next.js 15**, **NestJS**, **GraphQL**, and **Prisma**.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | [Next.js 15](https://nextjs.org/) (App Router, Turbopack), [Apollo Client](https://www.apollographql.com/docs/react/), Tailwind CSS 4 |
| **Backend** | [NestJS](https://nestjs.com/), [GraphQL (Apollo)](https://docs.nestjs.com/graphql/quick-start), [Passport.js](https://www.passportjs.org/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/) |
| **Containerization** | [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/) |
| **Monorepo** | NPM Workspaces |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## ⚡ Quick Start (Recommended — Docker)

> Prerequisites: [Docker Desktop](https://www.docker.com/products/docker-desktop/) and [Node.js 20+](https://nodejs.org/)

### 1. Clone the repository
```bash
git clone https://github.com/jatin-jatin42/slooze-eats.git
cd slooze-eats
```

### 2. Start the backend services (PostgreSQL + API)
```bash
docker compose up -d --build
```
This single command:
- Starts a **PostgreSQL 16** database container
- Builds and starts the **NestJS GraphQL API** on port `3001`
- Automatically synchronizes the database schema on startup using `prisma db push`

> On subsequent runs (no code changes), just use `docker compose up -d`.

### 3. Start the frontend
```bash
npm install      # first time only
npm run dev
```

The app is now running at:

| Service | URL |
|---|---|
| 🌐 Frontend (Next.js) | http://localhost:3000 |
| 🔌 GraphQL API | http://localhost:3001/api/graphql |
| 🗄️ PostgreSQL | localhost:5432 |

### 4. Seed the database (First run only)
If this is your first time setting up the project, seed the database with initial users, restaurants, and mock data:
```bash
docker compose exec api npm run db:seed
```

---

## 🏗️ Project Structure

```text
slooze-eats/
├── apps/
│   ├── web/                  # Next.js 15 Frontend
│   │   ├── app/              # App Router pages
│   │   ├── components/       # Reusable UI components
│   │   └── lib/              # Apollo client, auth context
│   └── api/                  # NestJS Backend
│       ├── src/              # Application source
│       ├── prisma/           # Schema & seed data
│       └── Dockerfile        # API container definition
├── docker-compose.yml        # Orchestrates DB + API containers
├── .dockerignore             # Excludes unnecessary files from build
├── .env                      # Root environment variables
└── package.json              # Root workspace config + scripts
```

---

## 🐳 Docker Architecture

```
┌─────────────────────────────────────────────┐
│              Docker Compose                  │
│                                             │
│  ┌──────────────────┐  ┌─────────────────┐  │
│  │  postgres:16     │  │  slooze-api     │  │
│  │  port: 5432      │◄─│  port: 3001     │  │
│  └──────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────┘
          ▲                       ▲
          │ (not needed)          │ http://localhost:3001
          │                       │
┌─────────────────────────────────────────────┐
│         Next.js Dev Server (host)            │
│                  port: 3000                  │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Manual / Non-Docker Setup

<details>
<summary>Click to expand</summary>

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
Create a `.env` file at the root:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/postgres?schema=public"
JWT_SECRET="your-development-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:3001/api/graphql"
FRONTEND_URL="http://localhost:3000"
```

### 3. Database setup
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npx prisma migrate dev --schema=apps/api/prisma/schema.prisma

# (Optional) Seed the database
cd apps/api && npm run db:seed
```

### 4. Run services in separate terminals
```bash
# Terminal 1 — API (http://localhost:3001)
cd apps/api && npm run start:dev

# Terminal 2 — Frontend (http://localhost:3000)
npm run dev
```

</details>

---

## 🌐 Deployment (Vercel)

Deploy the **frontend** and **backend** as two separate Vercel projects.

### Project A — Frontend (`slooze-eats-web`)
| Setting | Value |
|---|---|
| Root Directory | `apps/web` |
| Framework Preset | `Next.js` |
| `NEXT_PUBLIC_API_URL` | `https://<your-api-domain>/api/graphql` |

### Project B — Backend (`slooze-eats-api`)
| Setting | Value |
|---|---|
| Root Directory | `apps/api` |
| Framework Preset | `Other` |
| Build Command | `cd ../.. && npm install && npm run prisma:generate && cd apps/api && npm run build` |
| Install Command | `cd ../.. && npm install` |
| Output Directory | `dist` |

**Environment variables for the API:**
- `DATABASE_URL` — Production PostgreSQL URL
- `JWT_SECRET` — Shared secret key
- `FRONTEND_URL` — Deployed frontend URL

---

## 🔒 Security & Authentication

- **JWT** — Handled via `Passport-JWT` with `httpOnly` cookie storage
- **Role-Based Access** — `ADMIN`, `MANAGER`, and `MEMBER` roles
- **CORS** — Restricted to the configured `FRONTEND_URL`

## 🧬 GraphQL API

The API is available at `/api/graphql`.  
Explore the schema and run queries using the **Apollo Sandbox** in development mode.
