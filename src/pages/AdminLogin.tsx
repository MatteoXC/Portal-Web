import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signIn, isAdmin } = useAuth();

  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (!password.trim()) {
      setError("Introduce la contraseña");
      return;
    }

    setSubmitting(true);
    const result = await signIn(password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate("/admin", { replace: true });
  };

  return (
    <Layout>
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 card-shadow">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Acceso de administración</h1>
            <p className="mt-1 text-sm text-muted-foreground">Gestión compartida de contenidos</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-foreground">Contraseña</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => { setPassword(event.target.value); setError(""); }}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Introduce la contraseña"
                autoComplete="current-password"
                autoFocus
              />
              {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
            </div>
            <button type="submit" disabled={submitting} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? "Comprobando..." : "Acceder"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
