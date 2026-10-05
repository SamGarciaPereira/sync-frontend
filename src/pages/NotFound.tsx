import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h1>404</h1>
      <p>Página não encontrada.</p>
      <Link to="/">Voltar para o início</Link>
    </div>
  );
}