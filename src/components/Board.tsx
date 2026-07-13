import type { Board as BoardType } from "../types";
import Column from "./Column";

type BoardProps = {
  board: BoardType;
};

function Board({ board }: BoardProps) {
  return (
    <div className="flex gap-4 p-6 overflow-x-auto min-h-screen bg-slate-900">
      {board.columns.map((column) => {
        const cards = column.cardIds.map((id) => board.cards[id]);
        return <Column key={column.id} column={column} cards={cards} />;
      })}
    </div>
  );
}

export default Board;
