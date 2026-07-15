# TaskFlow

A Kanban-style task board, built to practice React + TypeScript with
drag-and-drop, state management, and eventually a real backend.

## Stack

- Frontend: React + TypeScript + Vite, Tailwind CSS
- Drag-and-drop: dnd-kit
- State management: Zustand
- Backend (in progress): Node + Express, SQLite via Prisma
- Later: auth, deployed on Vercel + Render

## Status

Frontend is feature-complete: boards, columns, cards, drag-and-drop
(desktop + mobile), add/edit/delete for both cards and columns,
localStorage persistence, empty states, custom scrollbar. ESLint
passes clean.

Backend work has started — a bare Express server exists under
`server/` with a health-check route, no database wired up yet. The
frontend is still running entirely on localStorage for now; nothing
talks to the backend yet.

## Running locally

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
- [ ] Prisma + SQLite schema
- [ ] CRUD API routes
- [ ] connect frontend to backend, replace localStorage
- [ ] auth
- [ ] deploy
