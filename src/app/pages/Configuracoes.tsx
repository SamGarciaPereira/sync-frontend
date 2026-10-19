import { Settings } from "lucide-react";
import { IconBadge } from "../components/IconBadge";

export function Configuracoes() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">
          Configurações
        </h1>
        <p className="mt-1.5 text-muted">Preferências da conta e do aplicativo.</p>
      </header>

      <div className="flex flex-col items-center rounded-card border border-dashed border-surface-border bg-surface/60 p-12 text-center">
        <IconBadge icon={Settings} size="lg" />
        <p className="mt-4 font-semibold text-heading">Em breve</p>
        <p className="mt-1 max-w-sm text-sm text-muted">
          As configurações ainda estão em construção nesta versão de teste.
        </p>
      </div>
    </div>
  );
}
