import { useDraggable } from "@dnd-kit/core";
import type { Card as CardType } from "../types";

type CardProps = {
  card: CardType;
};

function Card({ card }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: card.id,
    });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-slate-800 rounded-lg p-3 shadow-sm border border-slate-700 hover:border-slate-600 cursor-grab ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <h3 className="text-sm font-medium text-white mb-1">{card.title}</h3>
      <p className="text-xs text-slate-400 mb-2">{card.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {card.labels.map((label) => (
            <span
              key={label}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300"
            >
              {label}
            </span>
          ))}
        </div>
        {card.dueDate && (
          <span className="text-[10px] text-slate-500">{card.dueDate}</span>
        )}
      </div>
    </div>
  );
}

export default Card;
