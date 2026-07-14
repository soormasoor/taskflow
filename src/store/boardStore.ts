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
    }),
    {
      name: "taskflow-board",
    },
  ),
);
