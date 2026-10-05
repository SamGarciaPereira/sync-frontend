import { useState, useEffect } from "react";
import { api } from "../services/api";

interface ApiStatus {
  status?: string;
  message?: string;
  erro?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export function Status() {
  const [status, setStatus] = useState<ApiStatus | null>(null);

  useEffect(() => {
    let isMounted = true;

    api
      .get("/status")
      .then((res) => {
        if (isMounted) setStatus(res.data);
      })
      .catch((err: unknown) => {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        if (isMounted) setStatus({ erro: errorMessage });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Health Check do Backend</h1>
      <pre style={{ background: "#f3f4f6", padding: "1rem", borderRadius: "8px" }}>
        {JSON.stringify(status, null, 2)}
      </pre>
    </main>
  );
}