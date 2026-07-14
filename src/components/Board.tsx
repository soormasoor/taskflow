import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import type { Board as BoardType } from "../types";
import Column from "./Column";
import { useBoardStore } from "../store/boardStore";

type BoardProps = {
  board: BoardType;
};

function Board({ board }: BoardProps) {
  const moveCard = useBoardStore((state) => state.moveCard);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
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

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-6 overflow-x-auto">
        {board.columns.map((column) => {
          const cards = column.cardIds.map((id) => board.cards[id]);
          return <Column key={column.id} column={column} cards={cards} />;
        })}
      </div>
    </DndContext>
  );
}

export default Board;
