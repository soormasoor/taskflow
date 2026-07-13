import type { Board as BoardType } from "../types";
import Column from "./Column";
import { useBoardStore } from "../store/boardStore";

type BoardProps = {
  board: BoardType;
};

function Board({ board }: BoardProps) {
  const moveCard = useBoardStore((state) => state.moveCard);

  return (
    <div className="flex gap-4 p-6 overflow-x-auto min-h-screen bg-slate-900">
      {board.columns.map((column, index) => {
        const cards = column.cardIds.map((id) => board.cards[id]);
        const nextColumn = board.columns[index + 1];
        return (
          <Column
            key={column.id}
            column={column}
            cards={cards}
            onTestMove={
              nextColumn
                ? (cardId) => moveCard(cardId, column.id, nextColumn.id)
                : undefined
            }
          />
        );
      })}
    </div>
  );
}

export default Board;
