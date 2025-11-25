# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json ./
COPY package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build static site
RUN npm run build

# Production stage
FROM caddy:2-alpine

# Copy build output
COPY --from=builder /app/build /usr/share/caddy

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Caddy starts automatically
