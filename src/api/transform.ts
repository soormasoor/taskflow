import type { Board, Card, Column } from "../types";

type ServerCard = {
  id: string;
  title: string;
  description: string;
  labels: string[];
  dueDate: string | null;
  order: number;
  columnId: string;
};

type ServerColumn = {
  id: string;
  title: string;
  order: number;
  boardId: string;
  cards: ServerCard[];
};

type ServerBoard = {
  id: string;
  title: string;
  createdAt: string;
  columns: ServerColumn[];
};

export function toFrontendBoard(serverBoard: ServerBoard): Board {
  const cards: Record<string, Card> = {};

  const columns: Column[] = serverBoard.columns
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((serverColumn) => {
      const sortedCards = serverColumn.cards
        .slice()
        .sort((a, b) => a.order - b.order);

      sortedCards.forEach((serverCard) => {
        cards[serverCard.id] = {
          id: serverCard.id,
          title: serverCard.title,
          description: serverCard.description,
          labels: serverCard.labels,
          dueDate: serverCard.dueDate,
        };
      });

      return {
        id: serverColumn.id,
        title: serverColumn.title,
        cardIds: sortedCards.map((card) => card.id),
      };
    });

  return { columns, cards };
}
