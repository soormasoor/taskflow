import type { Column as ColumnType, Card as CardType } from "../types";
import Card from "./Card";

type ColumnProps = {
  column: ColumnType;
  cards: CardType[];
  onTestMove?: (cardId: string) => void;
};

function Column({ column, cards, onTestMove }: ColumnProps) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-3 w-72 flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-200">{column.title}</h2>
        <span className="text-xs text-slate-500">{cards.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onTestMove={onTestMove ? () => onTestMove(card.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export default Column;
