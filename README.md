# TaskFlow

A Kanban-style task board, built to practice React + TypeScript with
drag-and-drop, state management, and a real backend.

## Stack

- Frontend: React + TypeScript + Vite, Tailwind CSS
- Drag-and-drop: dnd-kit
- State management: Zustand
- Backend: Node + Express, SQLite via Prisma
- Later: auth, deployed on Vercel + Render

## Status

Full stack, working end to end. Frontend: boards, columns, cards,
drag-and-drop (desktop + mobile), add/edit/delete for cards and
columns, empty states, custom scrollbar, loading and error states.
Backend: Express + Prisma + SQLite, full CRUD for boards, columns,
and cards. The frontend now reads and writes through the real API —
localStorage has been fully removed. Card moves are optimistic (UI
updates instantly, rolls back if the request fails); everything else
waits for server confirmation before updating.

Single-board scope for now: on first load, the app fetches existing
boards or creates one automatically if none exist. No board-switching
UI yet.

## Running locally

Copy `.env.example` to `.env` at the project root (frontend) and in
`server/` — defaults should work for local dev.

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
- [x] Express server, Prisma + SQLite
- [x] board + column + card CRUD routes
- [x] frontend wired to real backend, localStorage removed
- [x] loading + error states
- [ ] auth
- [ ] deploy
