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

Cards can be picked up and dragged around (dnd-kit), but there's no
drop logic yet — dropping a card doesn't move it between columns.
State is still local (Zustand), no persistence.

## Running locally

\`\`\`bash
npm install
npm run dev
\`\`\`

## Roadmap / TODO

- [ ] center the app title/header at the top
- [x] Zustand store for board state
- [ ] drag and drop cards between columns _(dragging works, drop logic in progress)_
- [ ] localStorage persistence
- [ ] card detail modal (edit title/desc/labels/due date)
- [ ] Express + SQLite backend
- [ ] auth
- [ ] deploy
