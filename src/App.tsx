import { useEffect, useState } from "react";
import Board from "./components/Board";
import AuthScreen from "./components/AuthScreen";
import { useBoardStore } from "./store/boardStore";
import { useAuthStore } from "./store/authStore";

function App() {
  const token = useAuthStore((state) => state.token);
  const isGuestAuth = useAuthStore((state) => state.isGuest);
  const logout = useAuthStore((state) => state.logout);

  const board = useBoardStore((state) => state.board);
  const isLoading = useBoardStore((state) => state.isLoading);
  const error = useBoardStore((state) => state.error);
  const loadBoard = useBoardStore((state) => state.loadBoard);
  const loadGuestBoard = useBoardStore((state) => state.loadGuestBoard);

  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [showSlowLoadMessage, setShowSlowLoadMessage] = useState(false);

  useEffect(() => {
    if (token) {
      loadBoard();
    } else if (isGuestAuth) {
      loadGuestBoard();
    }
  }, [token, isGuestAuth, loadBoard, loadGuestBoard]);

  useEffect(() => {
    if (!isLoading) {
      setShowSlowLoadMessage(false);
      return;
    }
    const timer = setTimeout(() => setShowSlowLoadMessage(true), 3000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (!token && !isGuestAuth) {
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
          {isGuestAuth ? "exit guest mode" : "log out"}
        </button>
      </header>

      {isGuestAuth && !bannerDismissed && (
        <div className="bg-amber-950/40 border-b border-amber-900/50 text-amber-200 text-xs text-center py-2 px-4 flex items-center justify-center gap-3 relative">
          <span>
            You're in guest mode — your board is saved only in this browser, not
            on our servers. Register for a free account to access it anywhere.
          </span>
          <button
            onClick={() => setBannerDismissed(true)}
            className="absolute right-4 text-amber-300 hover:text-amber-100"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <p className="text-slate-400 text-sm">Loading board...</p>
          {showSlowLoadMessage && (
            <p className="text-slate-500 text-xs max-w-xs text-center">
              The backend is hosted on a free tier that sleeps when idle — first
              load after a while can take up to a minute. Thanks for your
              patience!
            </p>
          )}
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
