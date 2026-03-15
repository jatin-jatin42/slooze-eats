# 🍔 Slooze Eats - Modern Food Delivery Platform

A high-performance, full-stack monorepo food delivery application built with **Next.js 15**, **NestJS**, **GraphQL**, and **Prisma**.

## 🚀 Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack), [Apollo Client](https://www.apollographql.com/docs/react/), Tailwind CSS 4.
- **Backend**: [NestJS](https://nestjs.com/), [GraphQL (Apollo)](https://docs.nestjs.com/graphql/quick-start), [Passport.js](https://www.passportjs.org/).
- **Database**: [PostgreSQL (Neon)](https://neon.tech/) with [Prisma ORM](https://www.prisma.io/).
- **Monorepo**: NPM Workspaces.
- **Deployment**: [Vercel](https://vercel.com/).

---

## 🛠️ Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/jatin-jatin42/slooze-eats.git
cd slooze-eats
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/neondb?sslmode=require"

# Auth
JWT_SECRET="your-development-secret-key"

# URLs
NEXT_PUBLIC_API_URL="http://localhost:3001/api/graphql"
FRONTEND_URL="http://localhost:3000"
```

### 4. Database Initialization
```bash
# Generate Prisma Client
npm run prisma:generate

# Run Migrations
npx prisma migrate dev --schema=apps/api/prisma/schema.prisma

# (Optional) Seed the database
npm run db:seed --prefix apps/api
```

### 5. Run the Application
Launch both Frontend and Backend concurrently:
```bash
# In separate terminals or using concurrently
npm run dev --workspace web    # Frontend on http://localhost:3000
npm run start:dev --workspace api # Backend on http://localhost:3001
```

---

## 🌐 Deployment (Vercel Monorepo)

For the most stable setup, deploy the **Frontend** and **Backend** as two separate project on Vercel.

### Project A: Frontend (`slooze-eats-web`)
1. **Root Directory**: `apps/web`
2. **Framework Preset**: `Next.js`
3. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Your deployed API URL (e.g., `https://api.domain.com/api/graphql`)

### Project B: Backend (`slooze-eats-api`)
1. **Root Directory**: `apps/api`
2. **Framework Preset**: `Other`
3. **Build Command**:
   `cd ../.. && npm install && npm run prisma:generate && cd apps/api && npm run build`
4. **Install Command**: `cd ../.. && npm install`
5. **Output Directory**: `dist`
6. **Environment Variables**:
   - `DATABASE_URL`: Your Production Neon URL (include `&pgbouncer=true`).
   - `JWT_SECRET`: Same secret used in local/shared.
   - `FRONTEND_URL`: Your deployed Frontend URL.

---

## 🏗️ Project Structure

```text
.
├── apps/
│   ├── web/          # Next.js Frontend
│   └── api/          # NestJS Backend + Prisma Schema
├── package.json      # Root workspace configuration
└── vercel.json       # Routing rules for production
```

## 🔒 Security & Authentication
- **JWT**: Handled via `Passport-JWT` with `httpOnly` cookie storage for security.
- **Role-Based Access**: Support for ADMIN, MANAGER, and MEMBER roles.
- **CORS**: Configured to restrict access only to the specified `FRONTEND_URL`.

## 🧬 GraphQL API
The API is available at `/api/graphql`.
Explore the schema and run queries using the **Apollo Sandbox** while in development mode.
