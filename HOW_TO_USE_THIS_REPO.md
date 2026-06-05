# How to Use This Repo

This repository is a monorepo with two apps:

- `apps/api`: NestJS API + Prisma
- `apps/web`: Vite + React frontend

## What You Need

For a full Docker setup, you only need:

- Docker Desktop installed and running
- Docker Compose available
- Git to clone the repo

You do not need Node.js installed on your host machine to run the project with Docker.

## Fresh Clone -> Run Everything With Docker

### 1. Clone the repository

```bash
git clone <repo-url>
cd test-ned-TECH
```

### 2. Create the root `.env` file

Copy the example file:

```bash
copy .env.example .env
```

If you are using PowerShell and `copy` does not work, use:

```powershell
Copy-Item .env.example .env
```

The default values in `.env.example` are already suitable for local Docker use.

### 3. Check the ports

By default the stack uses:

- Postgres on `5433` on your machine
- API on `3000`
- Web app on `5173`

If `5433` is already used on your machine, change `POSTGRES_PORT` in `.env` before starting Docker.

### 4. Build and start the whole stack

Run this from the repository root:

```bash
docker compose up --build
```

This starts:

- `db` for PostgreSQL
- `api` for the NestJS backend
- `web` for the React frontend

The API container waits for the database, then automatically runs Prisma migrations and seeds the database before starting the server.

### 5. Open the application

Once the containers are up, open:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000`

## If You Want the Stack in the Background

Start detached:

```bash
docker compose up --build -d
```

Check logs:

```bash
docker compose logs -f api
docker compose logs -f web
docker compose logs -f db
```

Stop everything:

```bash
docker compose down
```

Remove the database volume too if you want a clean reset:

```bash
docker compose down -v
```

## What Docker Does Here

- The database runs in a Postgres container.
- The API image installs dependencies, builds the NestJS app, waits for Postgres, runs migrations, seeds data, then starts the server.
- The web image runs the Vite dev server inside Docker and exposes it on port `5173`.

## Useful Commands For Maintenance

If you need to rebuild after code changes or Docker cache issues:

```bash
docker compose up --build
```

If you need a full reset of the database state:

```bash
docker compose down -v
docker compose up --build
```

## Notes

- The root `package.json` uses npm workspaces, but you do not need to run `npm install` locally for the Docker workflow.
- The API reads `DATABASE_URL` from the container environment when running in Docker.
- The web app calls the API through `VITE_API_BASE_URL=http://localhost:3000/api`.