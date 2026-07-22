# TaskFlow

A Kanban-style task board, built to practice React + TypeScript with
drag-and-drop, state management, and a real backend.

**Live app:** https://taskflow-nine-alpha.vercel.app
**API:** https://taskflow-api-ihfe.onrender.com

The backend is hosted on Render's free tier, which spins down after
inactivity — the first request after a period of idle time can take
30-60 seconds to wake up. Subsequent requests are fast.

## Stack

- Frontend: React + TypeScript + Vite, Tailwind CSS — deployed on Vercel
- Drag-and-drop: dnd-kit
- State management: Zustand
- Backend: Node + Express, PostgreSQL via Prisma — deployed on Render
- Auth: JWT-based, bcrypt password hashing

## Status

Full stack, deployed, and working end to end, now with real auth.
Registering creates an account and an empty board; logging in loads
that user's own board and nobody else's. Token is stored in
localStorage so refreshing the page keeps you logged in.

Frontend: boards, columns, cards, drag-and-drop (desktop + mobile),
add/edit/delete for cards and columns, empty states, custom
scrollbar, loading and error states, login/register/logout.

Backend: Express + Prisma + Postgres, full CRUD for boards, columns,
and cards, all routes require a valid JWT and scope data to the
requesting user. Schema is applied via `prisma db push` rather than a
formal migration history, since the free-tier database role doesn't
have the permissions Prisma's `migrate dev` needs for its
shadow-database step. External connections require SSL
(`sslmode=require`).

Not yet built: a guest/demo mode for trying the app without creating
an account (planned next).

## Running locally

Copy `.env.example` to `.env` at the project root (frontend) and in
`server/`, and fill in your own Postgres connection string and a JWT
secret for the backend one.

Frontend:

```bash
npm install
npm run dev
```

Backend (separate terminal):

```bash
cd server
npm install
npm run dev
```

Useful scripts: `npm run lint`, `npm run typecheck`.

## Deployment

Frontend is deployed on Vercel, root directory at the repo root,
`VITE_API_URL` pointed at the live backend. Backend is deployed on
Render as a web service with root directory `server`, build command
`npm install && npm run build && npx prisma db push`, start command
`npm start`, and `DATABASE_URL`/`JWT_SECRET` set as environment
variables.

**Note:** deploying this update will require setting `JWT_SECRET` on
the live Render service if it isn't already there, and the live
frontend needs a fresh deploy to pick up the new auth-aware code.

## Roadmap / TODO

- [x] center the app title/header at the top
- [x] Zustand store for board state
- [x] drag and drop cards between columns
- [x] add card modal (title/description/labels/due date)
- [x] card detail modal (view/edit/delete existing cards)
- [x] empty column state
- [x] add/rename/delete columns
- [x] mobile touch drag-and-drop support
- [x] Express server, Prisma + Postgres
- [x] board + column + card CRUD routes
- [x] frontend wired to real backend
- [x] loading + error states
- [x] deploy backend (Render) + frontend (Vercel)
- [x] user model, register/login routes
- [x] protect existing routes with auth, tie boards to users
- [x] frontend login/register UI
- [ ] guest/demo mode (local-only, no account needed)
- [ ] deploy auth updates to production
