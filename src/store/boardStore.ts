import { create } from "zustand";
import type { Board, Column } from "../types";
import {
  fetchBoards,
  createBoard,
  fetchBoard,
  createColumnApi,
  renameColumnApi,
  deleteColumnApi,
  createCardApi,
  updateCardApi,
  moveCardApi,
  deleteCardApi,
} from "../api/client";
import { toFrontendBoard } from "../api/transform";

type NewCardInput = {
  title: string;
  description: string;
  labels: string[];
  dueDate: string | null;
};

type BoardStore = {
  board: Board | null;
  boardId: string | null;
  isLoading: boolean;
  error: string | null;
  loadBoard: () => Promise<void>;
  moveCard: (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
  ) => Promise<void>;
  addCard: (columnId: string, input: NewCardInput) => Promise<void>;
  updateCard: (cardId: string, input: NewCardInput) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  addColumn: (title: string) => Promise<void>;
  renameColumn: (columnId: string, title: string) => Promise<void>;
  deleteColumn: (columnId: string) => Promise<void>;
};

export const useBoardStore = create<BoardStore>((set, get) => ({
  board: null,
  boardId: null,
  isLoading: true,
  error: null,

  loadBoard: async () => {
    set({ isLoading: true, error: null });
    try {
      const boards = await fetchBoards();
      const summary = boards[0] ?? (await createBoard("My Board"));
      const fullBoard = await fetchBoard(summary.id);
      set({
        board: toFrontendBoard(fullBoard),
        boardId: summary.id,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load board",
        isLoading: false,
      });
    }
  },

  moveCard: async (cardId, fromColumnId, toColumnId) => {
    const state = get();
    if (!state.board) return;

    // optimistic: update local state immediately
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
    const previousBoard = state.board;
    set({ board: { ...state.board, columns } });

    const newOrder =
      columns.find((col) => col.id === toColumnId)!.cardIds.length - 1;

    try {
      await moveCardApi(cardId, toColumnId, newOrder);
    } catch (err) {
      // rollback on failure
      set({
        board: previousBoard,
        error: err instanceof Error ? err.message : "Failed to move card",
      });
    }
  },

  addCard: async (columnId, input) => {
    const state = get();
    if (!state.board) return;
    try {
      const serverCard = await createCardApi(columnId, input);
      const board = state.board;
      set({
        board: {
          ...board,
          cards: {
            ...board.cards,
            [serverCard.id]: { ...input, id: serverCard.id },
          },
          columns: board.columns.map((column) =>
            column.id === columnId
              ? { ...column, cardIds: [...column.cardIds, serverCard.id] }
              : column,
          ),
        },
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to add card" });
    }
  },

  updateCard: async (cardId, input) => {
    const state = get();
    if (!state.board) return;
    try {
      await updateCardApi(cardId, input);
      const board = state.board;
      set({
        board: {
          ...board,
          cards: { ...board.cards, [cardId]: { id: cardId, ...input } },
        },
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update card",
      });
    }
  },

  deleteCard: async (cardId) => {
    const state = get();
    if (!state.board) return;
    try {
      await deleteCardApi(cardId);
      const board = state.board;
      const { [cardId]: _removed, ...remainingCards } = board.cards;
      set({
        board: {
          ...board,
          cards: remainingCards,
          columns: board.columns.map((column) => ({
            ...column,
            cardIds: column.cardIds.filter((id) => id !== cardId),
          })),
        },
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete card",
      });
    }
  },

  addColumn: async (title) => {
    const state = get();
    if (!state.board || !state.boardId) return;
    try {
      const serverColumn = await createColumnApi(state.boardId, title);
      const board = state.board;
      const newColumn: Column = { id: serverColumn.id, title, cardIds: [] };
      set({ board: { ...board, columns: [...board.columns, newColumn] } });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to add column",
      });
    }
  },

  renameColumn: async (columnId, title) => {
    const state = get();
    if (!state.board) return;
    try {
      await renameColumnApi(columnId, title);
      const board = state.board;
      set({
        board: {
          ...board,
          columns: board.columns.map((column) =>
            column.id === columnId ? { ...column, title } : column,
          ),
        },
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to rename column",
      });
    }
  },

  deleteColumn: async (columnId) => {
    const state = get();
    if (!state.board) return;
    try {
      await deleteColumnApi(columnId);
      const board = state.board;
      const column = board.columns.find((col) => col.id === columnId);
      if (!column) return;
      const cards = { ...board.cards };
      column.cardIds.forEach((cardId) => {
        delete cards[cardId];
      });
      set({
        board: {
          ...board,
          columns: board.columns.filter((col) => col.id !== columnId),
          cards,
        },
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete column",
      });
    }
  },
}));
