import { Link } from "react-router-dom";

export function Header() {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", padding: "1rem 2rem", borderBottom: "1px solid #e5e7eb" }}>
      <h2 style={{ margin: 0, fontWeight: "bold" }}>Sync System</h2>
      <nav style={{ display: "flex", gap: "1.5rem" }}>
        <Link to="/">Home</Link>
        <Link to="/users">Usuários (API)</Link>
        <Link to="/status">Status da API</Link>
      </nav>
    </header>
  );
}
