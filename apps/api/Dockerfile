# Use Node.js LTS
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package configurations
COPY package.json ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install

# Copy code
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Build code
RUN pnpm run build

# Production Image
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./
COPY prisma ./prisma/
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV PORT=3001
EXPOSE 3001

CMD ["pnpm", "run", "start"]
