# Agent brief for Codex / AI reviewer

## Project

Node.js homework **01-express** — minimal Express backend for notes collection.

## Goals

- Keep the project aligned with the homework requirements from GoIT:
  - repository name: `nodejs-hw`
  - working branch: `01-express`
  - app uses Express, CORS, dotenv, pino-http
  - implements the required routes and middleware
- Maintain clean, consistent code style (ESLint + Prettier).
- Keep the server simple and beginner-friendly.

## Tech stack

- Node.js (ESM, `type: "module"`)
- Express
- cors
- dotenv
- pino-http + pino-pretty
- nodemon (dev)
- ESLint (flat config, JS recommended)
- Prettier

## File structure

- `src/server.js` — main Express app
- `.env` / `.env.example` — env variables (PORT, NODE_ENV)
- `eslint.config.mjs` — ESLint configuration
- `.prettierrc` — Prettier config
- `.editorconfig` — editor defaults
- `.gitignore` — standard Node/git ignores
- `agent.md` — this brief

## What the agent should check

1. **Basic requirements**
   - All required routes exist and respond as specified:
     - `GET /notes` → 200 + `{ "message": "Retrieved all notes" }`
     - `GET /notes/:noteId` → 200 + `{ "message": "Retrieved note with ID: <id>" }`
     - `GET /test-error` → throws error handled by error middleware
   - Middleware:
     - `express.json()` is registered
     - `cors()` is registered
     - `pino-http` is registered and logs requests
     - 404 middleware returns `{ "message": "Route not found" }` with status 404
     - error middleware returns 500 with JSON `{ message: ... }`

2. **Environment variables**
   - `.env` is **not** committed in real repo, only `.env.example`.
   - Server reads `process.env.PORT` (fallback `3000`).
   - `NODE_ENV` switches error message between detailed (development) and safe (production).

3. **Code quality**
   - No unused variables, no `console.log` left except server start and error logging.
   - Consistent import style (ESM).
   - No duplicated logic.
   - All routes and middleware are in `src/server.js` for this homework (no unnecessary abstractions).

4. **DX (developer experience)**
   - `npm run dev` uses nodemon to restart on file changes.
   - `npm run start` runs production server.
   - `npm run lint` works and passes.

## When making changes

- Do not introduce additional routes, databases or business logic beyond the homework unless explicitly requested.
- Keep the public API of this homework **minimal** and stable.
- If refactoring:
  - preserve the required responses and status codes;
  - keep the structure easy to understand for a beginner.

## Output format for reviews

When commenting on PRs, please:

- Group issues by categories: `logic`, `requirements`, `style`, `DX`.
- For each issue:
  - show **current code** (short snippet),
  - suggest **improved code**,
  - explain briefly *why* the change is needed (1–2 sentences).
