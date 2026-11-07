"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { Store, Role } from "../lib/types";
import { seed, student, employer } from "../lib/demo";
const Context = createContext<{
  state: Store;
  setState: Dispatch<SetStateAction<Store>>;
  ready: boolean;
  notify: (s: string) => void;
  login: (r: Role) => void;
} | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Store>(() => seed());
  const [ready, setReady] = useState(false),
    [toast, setToast] = useState("");
  useEffect(() => {
    try {
      const raw = localStorage.getItem("firstproof-hiring-v2");
      if (raw) {
        const value = JSON.parse(raw);
        if (
          value.version === 2 &&
          Array.isArray(value.opportunities) &&
          Array.isArray(value.applications)
        )
          setState(value);
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem("firstproof-hiring-v2", JSON.stringify(state));
      } catch {
        setToast(
          "Browser storage is full. Recent changes may not survive refresh.",
        );
      }
  }, [state, ready]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 5500);
    return () => clearTimeout(id);
  }, [toast]);
  return (
    <Context.Provider
      value={{
        state,
        setState,
        ready,
        notify: setToast,
        login: (r) =>
          setState((s) => ({
            ...s,
            user:
              r === "student" ? { ...student, ...s.profile } : { ...employer },
          })),
      }}
    >
      {children}
      {toast && (
        <div className="toast" role="status">
          {toast}
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            ×
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
export function useStore() {
  const c = useContext(Context);
  if (!c) throw new Error("Missing store");
  return c;
}
