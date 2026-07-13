import type { Board } from "../types";

export const mockBoard: Board = {
  columns: [
    { id: "col-todo", title: "To Do", cardIds: ["card-1", "card-2", "card-3"] },
    { id: "col-in-progress", title: "In Progress", cardIds: ["card-4"] },
    { id: "col-done", title: "Done", cardIds: ["card-5"] },
  ],
  cards: {
    "card-1": {
      id: "card-1",
      title: "Set up project structure",
      description: "Vite + TS + Tailwind, basic folder layout",
      labels: ["setup"],
      dueDate: null,
    },
    "card-2": {
      id: "card-2",
      title: "Design card component",
      description: "Figure out what fields a card needs",
      labels: ["design"],
      dueDate: "2026-07-20",
    },
    "card-3": {
      id: "card-3",
      title: "Research drag and drop libs",
      description: "dnd-kit vs react-beautiful-dnd",
      labels: ["research"],
      dueDate: null,
    },
    "card-4": {
      id: "card-4",
      title: "Build static board layout",
      description: "Columns + cards with fake data, no state yet",
      labels: ["frontend"],
      dueDate: "2026-07-16",
    },
    "card-5": {
      id: "card-5",
      title: "Initial repo setup",
      description: "git init, vite scaffold, tailwind config",
      labels: ["setup"],
      dueDate: "2026-07-14",
    },
  },
};
