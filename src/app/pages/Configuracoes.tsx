import { Link } from "react-router-dom";
import { ChevronRight, Settings, Siren } from "lucide-react";
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

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-heading">Emergência</h2>
        <Link
          to="/app/contatos"
          className="flex items-center gap-3 rounded-card border border-surface-border bg-surface p-4 shadow-card transition-colors hover:bg-sage/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
        >
          <IconBadge icon={Siren} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-heading">Contatos de emergência</p>
            <p className="text-sm text-muted">
              Quem será avisado quando você usar o botão de SOS.
            </p>
          </div>
          <ChevronRight size={20} className="shrink-0 text-faint" aria-hidden="true" />
        </Link>
      </section>

      <div className="flex flex-col items-center rounded-card border border-dashed border-surface-border bg-surface/60 p-12 text-center">
        <IconBadge icon={Settings} size="lg" />
        <p className="mt-4 font-semibold text-heading">Mais configurações em breve</p>
        <p className="mt-1 max-w-sm text-sm text-muted">
          Outras preferências ainda estão em construção nesta versão de teste.
        </p>
      </div>
    </div>
  );
}
