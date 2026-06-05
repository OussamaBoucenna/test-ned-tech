# Employee Directory

Projet full stack avec:

- `apps/api`: NestJS + Prisma + PostgreSQL
- `apps/web`: React + Vite

## Prerequis

- Docker Desktop
- Docker Compose

## Ports par defaut

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000/api`
- PostgreSQL: `localhost:5433`

Si `5433` est deja utilise sur votre machine, changez `POSTGRES_PORT` dans `.env`.

## Configuration `.env`

Depuis la racine du projet, creez le fichier `.env` a partir de `.env.example`:


Valeurs principales par defaut:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/employee_directory?schema=public
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=employee_directory
POSTGRES_PORT=5433

PORT=3000
NODE_ENV=development
JWT_SECRET=change_me
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173

VITE_API_BASE_URL=http://localhost:3000/api
```

## Lancer le projet

Depuis la racine:

```bash
docker compose up --build
```

Cette commande:

- lance PostgreSQL
- build l'API
- build le frontend
- applique les migrations Prisma
- execute le seed
- demarre toute l'application

## Acces

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000/api`

## Compte par defaut

- Email: `admin@example.com`
- Mot de passe: `password123`

## Commandes utiles

Arreter:

```bash
docker compose down
```

Reset complet de la base:

```bash
docker compose down -v
docker compose up --build
```
