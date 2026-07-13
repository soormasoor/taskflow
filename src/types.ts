export type Card = {
  id: string;
  title: string;
  description: string;
  labels: string[];
  dueDate: string | null;
};

export type Column = {
  id: string;
  title: string;
  cardIds: string[];
};

export type Board = {
  columns: Column[];
  cards: Record<string, Card>;
};
