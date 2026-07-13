import Board from "./components/Board";
import { useBoardStore } from "./store/boardStore";

function App() {
  const board = useBoardStore((state) => state.board);
  return <Board board={board} />;
}

export default App;
