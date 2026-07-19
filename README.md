# TaskFlow

A Kanban-style task board, built to practice React + TypeScript with
drag-and-drop, state management, and a real backend.

## Stack

- Frontend: React + TypeScript + Vite, Tailwind CSS
- Drag-and-drop: dnd-kit
- State management: Zustand
- Backend: Node + Express, PostgreSQL via Prisma
- Later: auth, deployed on Vercel + Render

## Status

Full stack, working end to end, now running on a real hosted Postgres
database (Render) both locally and eventually in production — chosen
over SQLite specifically to avoid dev/prod environment mismatches.
Schema is applied via `prisma db push` rather than a formal migration
history, since Render's free-tier database role doesn't have the
permissions Prisma's `migrate dev` needs for its shadow-database step.

Frontend: boards, columns, cards, drag-and-drop (desktop + mobile),
add/edit/delete for cards and columns, empty states, custom
scrollbar, loading and error states. Backend: Express + Prisma +
Postgres, full CRUD for boards, columns, and cards, external
connections require SSL (`sslmode=require`).

Single-board scope for now: on first load, the app fetches existing
boards or creates one automatically if none exist. No board-switching
UI yet. Not yet deployed — running locally against the hosted
database.

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
- [ ] deploy backend + frontend
- [ ] auth
