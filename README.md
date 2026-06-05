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

## Architectural decisions

- Auth: le JWT est stocke dans un cookie `httpOnly` plutot que dans `localStorage`. Cela reduit l'exposition aux vols de token via JavaScript en cas de XSS, au prix d'un peu plus d'attention sur la configuration CORS/cookies.
- Structure: le repo est separe en `apps/api` et `apps/web` pour garder une separation claire entre backend et frontend, tout en partageant une configuration Docker unique a la racine.
- Logging: l'audit log passe par un interceptor NestJS pour centraliser le suivi des actions mutables sans melanger cette logique avec les services metier.

## Known limitations & next steps

- Ajouter du rate limiting sur le login pour limiter les tentatives abusives.
- Ajouter du cache cote backend sur quelques routes importantes, par exemple les catalogues (`roles`, `departments`) et certaines listes consultees frequemment.

