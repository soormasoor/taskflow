import type { Card as CardType } from "../types";

type CardContentProps = {
  card: CardType;
};

function CardContent({ card }: CardContentProps) {
  return (
    <>
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
    </>
  );
}

export default CardContent;
