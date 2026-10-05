import { Link } from "react-router-dom";

export function Home() {
  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>sync frontend</h1>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <Link to="/users" style={{ padding: "0.5rem 1rem", background: "#000", color: "#fff", textDecoration: "none", borderRadius: "6px" }}>
          Gerenciar Usuários
        </Link>
        <Link to="/status" style={{ padding: "0.5rem 1rem", border: "1px solid #ccc", textDecoration: "none", borderRadius: "6px" }}>
          Ver Status da API
        </Link>
      </div>
    </main>
  );
}