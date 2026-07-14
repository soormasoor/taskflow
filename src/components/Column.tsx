import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { Column as ColumnType, Card as CardType } from "../types";
import Card from "./Card";
import AddCardModal from "./AddCardModal";

type ColumnProps = {
  column: ColumnType;
  cards: CardType[];
};

function Column({ column, cards }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg p-3 w-72 flex-shrink-0 ${
        isOver ? "bg-slate-800/50" : "bg-slate-900/50"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-200">{column.title}</h2>
        <span className="text-xs text-slate-500">{cards.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-2 text-xs text-slate-500 hover:text-slate-300 w-full text-left"
      >
        + add card
      </button>
      {isModalOpen && (
        <AddCardModal
          columnId={column.id}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Column;
