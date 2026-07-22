import { useEffect } from "react";
import Board from "./components/Board";
import AuthScreen from "./components/AuthScreen";
import { useBoardStore } from "./store/boardStore";
import { useAuthStore } from "./store/authStore";

function App() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const board = useBoardStore((state) => state.board);
  const isLoading = useBoardStore((state) => state.isLoading);
  const error = useBoardStore((state) => state.error);
  const loadBoard = useBoardStore((state) => state.loadBoard);

  useEffect(() => {
    if (token) {
      loadBoard();
    }
  }, [token, loadBoard]);

  if (!token) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="py-6 px-6 flex items-center justify-center relative border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
        <button
          onClick={logout}
          className="absolute right-6 text-xs text-slate-400 hover:text-slate-200"
        >
          log out
        </button>
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
