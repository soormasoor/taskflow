import { useEffect } from "react";
import Board from "./components/Board";
import { useBoardStore } from "./store/boardStore";

function App() {
  const board = useBoardStore((state) => state.board);
  const isLoading = useBoardStore((state) => state.isLoading);
  const error = useBoardStore((state) => state.error);
  const loadBoard = useBoardStore((state) => state.loadBoard);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="py-6 text-center border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
      </header>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-400 text-sm">Loading board...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-red-400 text-sm">
            Couldn't load the board: {error}
          </p>
        </div>
      )}

      {board && !isLoading && !error && <Board board={board} />}
    </div>
  );
}

export default App;
