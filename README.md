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
- Later: auth

## Status

Full stack, deployed, and working end to end.

Frontend: boards, columns, cards, drag-and-drop (desktop + mobile),
add/edit/delete for cards and columns, empty states, custom
scrollbar, loading and error states.

Backend: Express + Prisma + Postgres, full CRUD for boards, columns,
and cards. Schema is applied via `prisma db push` rather than a
formal migration history, since the free-tier database role doesn't
have the permissions Prisma's `migrate dev` needs for its
shadow-database step. External connections require SSL
(`sslmode=require`).

Single-board scope for now: on first load, the app fetches existing
boards or creates one automatically if none exist. No board-switching
UI yet, and no auth yet — anyone with the link can use the one board.

## Running locally

Copy `.env.example` to `.env` at the project root (frontend) and in
`server/`, and fill in your own Postgres connection string for the
backend one.

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
`npm start`, and `DATABASE_URL` set as an environment variable
pointing at a Render Postgres instance.

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
- [ ] auth
