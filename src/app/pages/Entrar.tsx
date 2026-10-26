import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { Button } from "../components/Button";
import { FieldLabel } from "../components/FieldLabel";
import { PasswordField } from "../components/PasswordField";
import { TextField } from "../components/TextField";
import { AuthLayout } from "../layout/AuthLayout";
import { useAuth } from "../auth/authContext";
import { getApiErrorMessage } from "../../services/errors";

export function Entrar() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Page the user tried to open before being sent to the login
  const from = (location.state as { from?: string } | null)?.from ?? "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Informe o e-mail e a senha.");
      return;
    }

    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Que bom ver você de novo!"
      footer={
        <>
          Ainda não tem cadastro?{" "}
          <Link
            to="/cadastro"
            className="font-semibold text-forest underline underline-offset-4 hover:text-forest-strong"
          >
            Cadastre-se aqui!
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <FieldLabel htmlFor="login-email">E-mail</FieldLabel>
          <TextField
            id="login-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <FieldLabel htmlFor="login-password">Senha</FieldLabel>
          <PasswordField
            id="login-password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={submitting}
          leftIcon={<LogIn size={20} />}
        >
          {submitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </AuthLayout>
  );
}
