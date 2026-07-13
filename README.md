# TaskFlow

A Kanban-style task board, built to practice React + TypeScript with
drag-and-drop, state management, and eventually a real backend.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- dnd-kit (drag and drop) — not wired up yet
- Zustand (state management) — not wired up yet
- Later: Node/Express + SQLite (Prisma), basic auth, deployed on
  Vercel + Render

## Status

Drag and drop works — cards can be dragged between columns and the
board state updates correctly. Still local Zustand state, no
persistence yet, so a refresh resets everything back to the mock data.

## Running locally

```bash
npm install
npm run dev
```

## Roadmap / TODO

- [ ] center the app title/header at the top
- [x] Zustand store for board state
- [x] drag and drop cards between columns
- [ ] localStorage persistence
- [ ] card detail modal (edit title/desc/labels/due date)
- [ ] Express + SQLite backend
- [ ] auth
- [ ] deploy
