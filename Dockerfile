# Use Node.js LTS
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace configurations and package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/api/prisma ./apps/api/prisma/

# Install monorepo dependencies
RUN pnpm install --frozen-lockfile

# Copy all files
COPY . .

# Generate Prisma Client for backend
RUN pnpm --filter @guardianrs/api exec prisma generate

# Build backend API
RUN pnpm --filter @guardianrs/api run build

# Production Image
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy built artifacts and dependencies
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

# Hugging Face Spaces requires exposing and running on port 7860
ENV PORT=7860
EXPOSE 7860

# Run API start command
CMD ["pnpm", "--filter", "@guardianrs/api", "run", "start"]
