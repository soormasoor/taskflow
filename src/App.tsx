import Board from "./components/Board";
import { useBoardStore } from "./store/boardStore";

function App() {
  const board = useBoardStore((state) => state.board);

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="py-6 text-center border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
      </header>
      <Board board={board} />
    </div>
  );
}

export default App;
