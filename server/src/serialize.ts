type RawCard = {
  id: string;
  title: string;
  description: string;
  labels: string;
  dueDate: Date | null;
  order: number;
  columnId: string;
};

export function serializeCard(card: RawCard) {
  return {
    ...card,
    labels: card.labels ? card.labels.split(",").filter(Boolean) : [],
  };
}
