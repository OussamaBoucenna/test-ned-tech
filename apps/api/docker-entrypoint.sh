#!/bin/sh
set -e

# Wait for Postgres to accept connections before touching the schema.
echo "Waiting for the database..."
until node -e "
const net = require('net');
const url = new URL(process.env.DATABASE_URL);
const socket = net.connect(Number(url.port) || 5432, url.hostname);
socket.on('connect', () => { socket.end(); process.exit(0); });
socket.on('error', () => process.exit(1));
"; do
  echo "  database not ready yet, retrying in 2s..."
  sleep 2
done
echo "Database is up."

# Apply migrations and seed, then hand off to the container CMD (the API).
# The :docker variants read env from the container (no dotenv file here).
echo "Applying migrations..."
npm run prisma:deploy:docker --workspace apps/api

echo "Seeding database..."
npm run prisma:seed:docker --workspace apps/api

echo "Starting API..."
exec "$@"
