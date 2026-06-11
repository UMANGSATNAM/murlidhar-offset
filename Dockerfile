# Use official Node.js image to ensure maximum compatibility with Next.js standalone
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install libc6-compat for process compatibility and openssl for Prisma
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package manager files
COPY package.json bun.lock ./
COPY prisma ./prisma/

# Install bun globally and install dependencies
RUN npm install -g bun
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install bun in builder
RUN npm install -g bun

# Generate Prisma client and build Next.js
RUN bunx prisma generate
RUN bun run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1
ENV HOSTNAME "0.0.0.0"

RUN apk add --no-cache openssl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy Prisma and generated client
COPY --from=builder /app/prisma ./prisma
# Copy node_modules so that Prisma CLI can be used for db push at runtime
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

# Run prisma db push and start the server
# We use node to run server.js as it's the standard for Next.js standalone
CMD npx prisma db push --accept-data-loss && node server.js
