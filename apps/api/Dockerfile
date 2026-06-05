# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Prisma needs OpenSSL to detect the right query engine on Alpine.
RUN apk add --no-cache openssl

# Install workspace deps (root manifest + the api package manifest).
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
RUN npm ci

# Copy the api source and generate the Prisma client + build.
COPY apps/api ./apps/api
RUN npm run prisma:generate --workspace apps/api \
  && npm run build --workspace apps/api

# --- Runtime stage ---
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# OpenSSL is required by the Prisma query engine at runtime too.
RUN apk add --no-cache openssl

# Bring over installed deps, build output, Prisma schema/migrations and seed.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY package.json ./

COPY apps/api/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "apps/api/dist/src/main.js"]
