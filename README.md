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

Board state persists across refreshes (localStorage via Zustand's
persist middleware). Drag and drop between columns works. You can add
new cards to a column, though right now they're added with placeholder
text — a real "new card" form/modal is next. ESLint is set up and
currently passes clean. Still no backend — everything lives in the
browser.

## Running locally

```bash
npm install
npm run dev
```

## Roadmap / TODO

- [ ] center the app title/header at the top
- [x] Zustand store for board state
- [x] drag and drop cards between columns
- [x] localStorage persistence
- [ ] add card form (currently placeholder text only)
- [ ] card detail modal (edit title/desc/labels/due date)
- [ ] Express + SQLite backend
- [ ] auth
- [ ] deploy
