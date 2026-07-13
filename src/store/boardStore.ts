import { create } from "zustand";
import type { Board } from "../types";
import { mockBoard } from "../data/mockData";

type BoardStore = {
  board: Board;
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string) => void;
};

export const useBoardStore = create<BoardStore>((set) => ({
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
}));
