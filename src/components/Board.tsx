import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { Board as BoardType } from "../types";
import Column from "./Column";
import CardContent from "./CardContent";
import { useBoardStore } from "../store/boardStore";

type BoardProps = {
  board: BoardType;
};

function Board({ board }: BoardProps) {
  const moveCard = useBoardStore((state) => state.moveCard);
  const addColumn = useBoardStore((state) => state.addColumn);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveCardId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCardId(null);
    const { active, over } = event;
    if (!over) return;

    const cardId = active.id as string;
    const toColumnId = over.id as string;

    const fromColumn = board.columns.find((col) =>
      col.cardIds.includes(cardId),
    );
    if (!fromColumn || fromColumn.id === toColumnId) return;

    moveCard(cardId, fromColumn.id, toColumnId);
  }

  function handleAddColumn() {
    const trimmed = newColumnTitle.trim();
    if (trimmed) {
      addColumn(trimmed);
    }
    setNewColumnTitle("");
    setIsAddingColumn(false);
  }

  const activeCard = activeCardId ? board.cards[activeCardId] : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-6 overflow-x-auto items-start board-scroll">
        {board.columns.map((column) => {
          const cards = column.cardIds.map((id) => board.cards[id]);
          return <Column key={column.id} column={column} cards={cards} />;
        })}

        <div
          className={
            isAddingColumn ? "w-72 flex-shrink-0" : "w-40 flex-shrink-0"
          }
        >
          {isAddingColumn ? (
            <input
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onBlur={handleAddColumn}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddColumn();
                if (e.key === "Escape") {
                  setNewColumnTitle("");
                  setIsAddingColumn(false);
                }
              }}
              placeholder="Column title"
              className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-white w-full"
            />
          ) : (
            <button
              onClick={() => setIsAddingColumn(true)}
              className="text-sm text-slate-500 hover:text-slate-300 border border-dashed border-slate-700 hover:border-slate-600 rounded-lg px-3 py-2 w-full text-left"
            >
              + add column
            </button>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="bg-slate-800 rounded-lg p-3 shadow-lg border border-slate-600 w-64 rotate-2">
            <CardContent card={activeCard} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default Board;
