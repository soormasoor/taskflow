import { useDraggable } from "@dnd-kit/core";
import type { Card as CardType } from "../types";
import CardContent from "./CardContent";

type CardProps = {
  card: CardType;
  onClick?: () => void;
};

function Card({ card, onClick }: CardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: card.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`bg-slate-800 rounded-lg p-3 shadow-sm border border-slate-700 hover:border-slate-600 cursor-grab ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <CardContent card={card} />
    </div>
  );
}

export default Card;
