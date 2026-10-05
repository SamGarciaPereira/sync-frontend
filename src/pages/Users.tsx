import { useState, useEffect, useCallback } from "react";
import { isAxiosError } from "axios";
import { api } from "../services/api";

interface User {
  id: string | number;
  name: string;
  email: string;
}

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para recarregar após formulário (POST)
  const refreshUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<User[]>("/users");
      setUsers(res.data);
      setError(null);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Erro ao conectar à API. Verifique se o backend está rodando."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao carregar usuários.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Efeito isolado usando Promises assíncronas puras
  useEffect(() => {
    let ignore = false;

    api
      .get<User[]>("/users")
      .then((res) => {
        if (!ignore) {
          setUsers(res.data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          if (isAxiosError(err)) {
            setError(
              err.response?.data?.message ||
                "Erro ao conectar à API. Verifique se o backend está rodando."
            );
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Erro desconhecido ao carregar usuários.");
          }
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;

    try {
      await api.post("/users", { name, email, password: "tempPassword123" });
      setName("");
      setEmail("");
      await refreshUsers();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        alert(err.response?.data?.message || "Erro ao salvar.");
      } else {
        alert("Erro ao realizar cadastro.");
      }
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Usuários Registrados</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}
      >
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "0.5rem", flex: 1 }}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "0.5rem", flex: 1 }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            background: "#000",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Adicionar
        </button>
      </form>

      {loading && <p>Carregando usuários...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map((u) => (
          <li
            key={u.id}
            style={{ padding: "0.75rem", borderBottom: "1px solid #eee" }}
          >
            <strong>{u.name}</strong> - {u.email}
          </li>
        ))}
      </ul>
    </main>
  );
}