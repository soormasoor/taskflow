import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Board, Card } from "../types";
import { mockBoard } from "../data/mockData";

type NewCardInput = {
  title: string;
  description: string;
  labels: string[];
  dueDate: string | null;
};

type BoardStore = {
  board: Board;
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string) => void;
  addCard: (columnId: string, input: NewCardInput) => void;
  updateCard: (cardId: string, input: NewCardInput) => void;
  deleteCard: (cardId: string) => void;
  addColumn: (title: string) => void;
  renameColumn: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;
};

export const useBoardStore = create<BoardStore>()(
  persist(
    (set) => ({
      board: mockBoard,
      moveCard: (cardId, fromColumnId, toColumnId) =>
        set((state) => {
          const columns = state.board.columns.map((column) => {
            if (column.id === fromColumnId) {
              return {
                ...column,
                cardIds: column.cardIds.filter((id) => id !== cardId),
              };
            }
            if (column.id === toColumnId) {
              return { ...column, cardIds: [...column.cardIds, cardId] };
            }
            return column;
          });
          return { board: { ...state.board, columns } };
        }),
      addCard: (columnId, input) =>
        set((state) => {
          const id = `card-${crypto.randomUUID()}`;
          const newCard: Card = { id, ...input };

          const columns = state.board.columns.map((column) =>
            column.id === columnId
              ? { ...column, cardIds: [...column.cardIds, id] }
              : column,
          );

          return {
            board: {
              ...state.board,
              cards: { ...state.board.cards, [id]: newCard },
              columns,
            },
          };
        }),
      updateCard: (cardId, input) =>
        set((state) => ({
          board: {
            ...state.board,
            cards: {
              ...state.board.cards,
              [cardId]: { id: cardId, ...input },
            },
          },
        })),
      deleteCard: (cardId) =>
        set((state) => {
          const { [cardId]: _removed, ...remainingCards } = state.board.cards;

          const columns = state.board.columns.map((column) => ({
            ...column,
            cardIds: column.cardIds.filter((id) => id !== cardId),
          }));

          return {
            board: {
              ...state.board,
              cards: remainingCards,
              columns,
            },
          };
        }),
      addColumn: (title) =>
        set((state) => {
          const id = `col-${crypto.randomUUID()}`;
          return {
            board: {
              ...state.board,
              columns: [...state.board.columns, { id, title, cardIds: [] }],
            },
          };
        }),
      renameColumn: (columnId, title) =>
        set((state) => ({
          board: {
            ...state.board,
            columns: state.board.columns.map((column) =>
              column.id === columnId ? { ...column, title } : column,
            ),
          },
        })),
      deleteColumn: (columnId) =>
        set((state) => {
          const column = state.board.columns.find((col) => col.id === columnId);
          if (!column) return state;

          const cards = { ...state.board.cards };
          column.cardIds.forEach((cardId) => {
            delete cards[cardId];
          });

          return {
            board: {
              ...state.board,
              columns: state.board.columns.filter((col) => col.id !== columnId),
              cards,
            },
          };
        }),
    }),
    {
      name: "taskflow-board",
    },
  ),
);
