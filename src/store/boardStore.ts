import { create } from "zustand";
import type { Board, Card, Column } from "../types";
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

const GUEST_BOARD_KEY = "taskflow-guest-board";

type NewCardInput = {
  title: string;
  description: string;
  labels: string[];
  dueDate: string | null;
};

function emptyGuestBoard(): Board {
  return {
    columns: [
      { id: "guest-col-todo", title: "To Do", cardIds: [] },
      { id: "guest-col-in-progress", title: "In Progress", cardIds: [] },
      { id: "guest-col-done", title: "Done", cardIds: [] },
    ],
    cards: {},
  };
}

function loadGuestBoardFromStorage(): Board {
  const raw = localStorage.getItem(GUEST_BOARD_KEY);
  if (!raw) return emptyGuestBoard();
  try {
    return JSON.parse(raw) as Board;
  } catch {
    return emptyGuestBoard();
  }
}

function saveGuestBoardToStorage(board: Board) {
  localStorage.setItem(GUEST_BOARD_KEY, JSON.stringify(board));
}

type BoardStore = {
  board: Board | null;
  boardId: string | null;
  isLoading: boolean;
  error: string | null;
  isGuest: boolean;
  loadBoard: () => Promise<void>;
  loadGuestBoard: () => void;
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
  isGuest: false,

  loadBoard: async () => {
    set({ isLoading: true, error: null, isGuest: false });
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

  loadGuestBoard: () => {
    set({
      board: loadGuestBoardFromStorage(),
      boardId: null,
      isGuest: true,
      isLoading: false,
      error: null,
    });
  },

  moveCard: async (cardId, fromColumnId, toColumnId) => {
    const state = get();
    if (!state.board) return;

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
    const updatedBoard = { ...state.board, columns };
    set({ board: updatedBoard });

    if (state.isGuest) {
      saveGuestBoardToStorage(updatedBoard);
      return;
    }

    const newOrder =
      columns.find((col) => col.id === toColumnId)!.cardIds.length - 1;
    try {
      await moveCardApi(cardId, toColumnId, newOrder);
    } catch (err) {
      set({
        board: previousBoard,
        error: err instanceof Error ? err.message : "Failed to move card",
      });
    }
  },

  addCard: async (columnId, input) => {
    const state = get();
    if (!state.board) return;
    const board = state.board;

    if (state.isGuest) {
      const id = `guest-card-${crypto.randomUUID()}`;
      const newCard: Card = { id, ...input };
      const updatedBoard = {
        ...board,
        cards: { ...board.cards, [id]: newCard },
        columns: board.columns.map((column) =>
          column.id === columnId
            ? { ...column, cardIds: [...column.cardIds, id] }
            : column,
        ),
      };
      set({ board: updatedBoard });
      saveGuestBoardToStorage(updatedBoard);
      return;
    }

    try {
      const serverCard = await createCardApi(columnId, input);
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
    const board = state.board;

    if (state.isGuest) {
      const updatedBoard = {
        ...board,
        cards: { ...board.cards, [cardId]: { id: cardId, ...input } },
      };
      set({ board: updatedBoard });
      saveGuestBoardToStorage(updatedBoard);
      return;
    }

    try {
      await updateCardApi(cardId, input);
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
    const board = state.board;

    function withCardRemoved() {
      const { [cardId]: _removed, ...remainingCards } = board.cards;
      return {
        ...board,
        cards: remainingCards,
        columns: board.columns.map((column) => ({
          ...column,
          cardIds: column.cardIds.filter((id) => id !== cardId),
        })),
      };
    }

    if (state.isGuest) {
      const updatedBoard = withCardRemoved();
      set({ board: updatedBoard });
      saveGuestBoardToStorage(updatedBoard);
      return;
    }

    try {
      await deleteCardApi(cardId);
      set({ board: withCardRemoved() });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete card",
      });
    }
  },

  addColumn: async (title) => {
    const state = get();
    if (!state.board) return;
    const board = state.board;

    if (state.isGuest) {
      const id = `guest-col-${crypto.randomUUID()}`;
      const newColumn: Column = { id, title, cardIds: [] };
      const updatedBoard = { ...board, columns: [...board.columns, newColumn] };
      set({ board: updatedBoard });
      saveGuestBoardToStorage(updatedBoard);
      return;
    }

    if (!state.boardId) return;
    try {
      const serverColumn = await createColumnApi(state.boardId, title);
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
    const board = state.board;

    function withRenamedColumn() {
      return {
        ...board,
        columns: board.columns.map((column) =>
          column.id === columnId ? { ...column, title } : column,
        ),
      };
    }

    if (state.isGuest) {
      const updatedBoard = withRenamedColumn();
      set({ board: updatedBoard });
      saveGuestBoardToStorage(updatedBoard);
      return;
    }

    try {
      await renameColumnApi(columnId, title);
      set({ board: withRenamedColumn() });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to rename column",
      });
    }
  },

  deleteColumn: async (columnId) => {
    const state = get();
    if (!state.board) return;
    const board = state.board;

    function withColumnRemoved() {
      const column = board.columns.find((col) => col.id === columnId);
      if (!column) return board;
      const cards = { ...board.cards };
      column.cardIds.forEach((cardId) => {
        delete cards[cardId];
      });
      return {
        ...board,
        columns: board.columns.filter((col) => col.id !== columnId),
        cards,
      };
    }

    if (state.isGuest) {
      const updatedBoard = withColumnRemoved();
      set({ board: updatedBoard });
      saveGuestBoardToStorage(updatedBoard);
      return;
    }

    try {
      await deleteColumnApi(columnId);
      set({ board: withColumnRemoved() });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete column",
      });
    }
  },
}));
