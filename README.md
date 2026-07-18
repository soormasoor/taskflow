# TaskFlow

A Kanban-style task board, built to practice React + TypeScript with
drag-and-drop, state management, and eventually a real backend.

## Stack

- Frontend: React + TypeScript + Vite, Tailwind CSS
- Drag-and-drop: dnd-kit
- State management: Zustand
- Backend: Node + Express, SQLite via Prisma
- Later: auth, deployed on Vercel + Render

## Status

Frontend is feature-complete: boards, columns, cards, drag-and-drop
(desktop + mobile), add/edit/delete for both cards and columns, empty
states, custom scrollbar. ESLint passes clean.

Backend is functionally complete: Express + Prisma + SQLite, full CRUD
for boards, columns, and cards.

Currently connecting the two: an API client and a data-shape transform
(server's nested board → frontend's normalized board) are built and
verified against the real backend. The Zustand store itself still
runs on localStorage for now — swapping it over to the API is the
next step.

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

## Roadmap / TODO

- [x] center the app title/header at the top
- [x] Zustand store for board state
- [x] drag and drop cards between columns
- [x] localStorage persistence
- [x] add card modal (title/description/labels/due date)
- [x] card detail modal (view/edit/delete existing cards)
- [x] empty column state
- [x] add/rename/delete columns
- [x] mobile touch drag-and-drop support
- [x] bare Express server
- [x] Prisma + SQLite schema, init migration
- [x] board + column CRUD routes
- [x] card CRUD routes
- [x] frontend API client + data transform
- [ ] wire store to backend (replace localStorage), loading/error states
- [ ] auth
- [ ] deploy
