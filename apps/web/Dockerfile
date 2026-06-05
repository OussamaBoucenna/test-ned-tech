# Dev image — runs the Vite dev server with hot reload.
# Source is bind-mounted by docker-compose, so we only need deps here.
FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
RUN npm ci

COPY apps/web ./apps/web

EXPOSE 5173
# --host exposes the dev server outside the container.
CMD ["npm", "run", "dev", "--workspace", "apps/web", "--", "--host"]
