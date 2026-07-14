import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { Column as ColumnType, Card as CardType } from "../types";
import Card from "./Card";
import AddCardModal from "./AddCardModal";
import CardDetailModal from "./CardDetailModal";
import { useBoardStore } from "../store/boardStore";

type ColumnProps = {
  column: ColumnType;
  cards: CardType[];
};

function Column({ column, cards }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  const renameColumn = useBoardStore((state) => state.renameColumn);
  const deleteColumn = useBoardStore((state) => state.deleteColumn);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.title);

  function commitTitle() {
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== column.title) {
      renameColumn(column.id, trimmed);
    } else {
      setTitleDraft(column.title);
    }
    setIsEditingTitle(false);
  }

  function handleDeleteColumn() {
    const confirmed = window.confirm(
      `Delete "${column.title}" and all ${cards.length} card(s) in it?`,
    );
    if (confirmed) {
      deleteColumn(column.id);
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg p-3 w-72 flex-shrink-0 ${
        isOver ? "bg-slate-800/50" : "bg-slate-900/50"
      }`}
    >
      <div className="flex items-center justify-between mb-3 gap-2">
        {isEditingTitle ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTitle();
              if (e.key === "Escape") {
                setTitleDraft(column.title);
                setIsEditingTitle(false);
              }
            }}
            className="bg-slate-800 border border-slate-600 rounded px-2 py-0.5 text-sm text-white flex-1 min-w-0"
          />
        ) : (
          <h2
            onClick={() => setIsEditingTitle(true)}
            className="text-sm font-semibold text-slate-200 cursor-pointer flex-1 min-w-0 truncate"
          >
            {column.title}
          </h2>
        )}
        <span className="text-xs text-slate-500">{cards.length}</span>
        <button
          onClick={handleDeleteColumn}
          className="text-slate-600 hover:text-red-400 text-xs"
          title="Delete column"
        >
          ✕
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {cards.length === 0 ? (
          <p className="text-xs text-slate-600 italic py-2">No cards yet</p>
        ) : (
          cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => setSelectedCard(card)}
            />
          ))
        )}
      </div>
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="mt-2 text-xs text-slate-500 hover:text-slate-300 w-full text-left"
      >
        + add card
      </button>
      {isAddModalOpen && (
        <AddCardModal
          columnId={column.id}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}

export default Column;
