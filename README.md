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
persist middleware). Drag and drop between columns works on desktop
and mobile, using dnd-kit's DragOverlay so dragging doesn't cause
layout/scroll issues. You can add new cards via a modal, and click any
existing card to edit or delete it. Columns can be added, renamed
inline, and deleted (deleting a column deletes its cards too).
Custom-styled scrollbar for the horizontal board scroll. ESLint is set
up and currently passes clean. Still no backend — everything lives in
the browser.

Known limitation: on touch devices, dragging a card requires a brief
press-and-hold before it activates, to avoid conflicting with normal
page scrolling. A very quick swipe directly over a card may still
occasionally register as a drag rather than a scroll — this is an
inherent trade-off with touch-based drag-and-drop, not a bug we
expect to fully eliminate. Scrolling on empty space works normally.

## Running locally

```bash
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
- [ ] Express + SQLite backend
- [ ] auth
- [ ] deploy
