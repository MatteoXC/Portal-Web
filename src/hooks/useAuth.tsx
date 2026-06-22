import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAdmin: boolean;
  loading: boolean;
  signIn: (password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readError = async (response: Response, fallback: string) => {
  try {
    const body = await response.json() as { error?: unknown };
    return typeof body.error === "string" ? body.error : fallback;
  } catch {
    return fallback;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/auth/session", {
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return false;
        const body = await response.json() as { authenticated?: unknown };
        return body.authenticated === true;
      })
      .then(setIsAdmin)
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setIsAdmin(false);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const signIn = async (password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        return { error: await readError(response, "No se ha podido iniciar sesión") };
      }

      setIsAdmin(true);
      return { error: null };
    } catch {
      return { error: "No se puede conectar con el servidor de autenticación" };
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
