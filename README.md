# TaskFlow

A Kanban-style task board, built to practice React + TypeScript with
drag-and-drop, state management, and eventually a real backend.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- dnd-kit (drag and drop)
- Zustand (state management)
- Later: Node/Express + SQLite (Prisma), basic auth, deployed on
  Vercel + Render

## Status

Board state persists across refreshes (localStorage via Zustand's
persist middleware). Drag and drop between columns works. You can add
new cards via a modal, and click any existing card to edit or delete
it. Both modals share a common form component. ESLint is set up and
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
- [x] add card modal (title/description/labels/due date)
- [x] card detail modal (view/edit/delete existing cards)
- [ ] Express + SQLite backend
- [ ] auth
- [ ] deploy
