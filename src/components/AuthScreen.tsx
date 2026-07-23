import { useState } from "react";
import { useAuthStore } from "../store/authStore";

function AuthScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const continueAsGuest = useAuthStore((state) => state.continueAsGuest);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "login") {
      login(email, password);
    } else {
      register(email, password);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-sm border border-slate-700">
        <h1 className="text-xl font-bold text-white mb-1">TaskFlow</h1>
        <p className="text-sm text-slate-400 mb-6">
          {mode === "login" ? "Log in to your board" : "Create an account"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder:text-slate-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder:text-slate-500"
          />

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded px-3 py-2 text-sm font-medium mt-1"
          >
            {isLoading
              ? "Please wait..."
              : mode === "login"
                ? "Log in"
                : "Register"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-xs text-slate-400 hover:text-slate-300 mt-4 w-full text-center"
        >
          {mode === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Log in"}
        </button>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <button
            onClick={continueAsGuest}
            className="text-xs text-slate-500 hover:text-slate-300 w-full text-center"
          >
            Continue as guest — try it without an account
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;
