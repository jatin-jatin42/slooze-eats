FROM node:20-alpine

WORKDIR /app

# Install OpenSSL needed by Prisma
RUN apk add --no-cache openssl

# ── Install ONLY the API's own dependencies ─────────────────────────
# This avoids pulling in the entire monorepo (web app, Next.js, etc.)
COPY package.json ./package.json

# Use npm install (not ci) so it creates a lock from scratch for just the api
RUN npm install --ignore-scripts

# ── Copy source ──────────────────────────────────────────────────────
COPY prisma ./prisma/
COPY prisma.config.ts ./prisma.config.ts
COPY src ./src/
COPY tsconfig.json ./tsconfig.json
COPY tsconfig.build.json ./tsconfig.build.json
COPY nest-cli.json ./nest-cli.json

# ── Build ────────────────────────────────────────────────────────────
RUN npx prisma generate
RUN npx nest build

EXPOSE 3001

# At runtime: generate Prisma client (needs DB URL), push schema to DB missing migrations folder, then start
CMD ["sh", "-c", "npx prisma generate && npx prisma db push --accept-data-loss && node dist/main"]
