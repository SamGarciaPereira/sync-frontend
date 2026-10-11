import { CalendarDays } from "lucide-react";
import { IconBadge } from "../components/IconBadge";

export function Lembretes() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">Lembretes</h1>
        <p className="mt-1.5 text-muted">Seus avisos de horário de dose aparecerão aqui.</p>
      </header>

      <div className="flex flex-col items-center rounded-card border border-dashed border-surface-border bg-surface/60 p-12 text-center">
        <IconBadge icon={CalendarDays} size="lg" />
        <p className="mt-4 font-semibold text-heading">Em breve</p>
        <p className="mt-1 max-w-sm text-sm text-muted">
          Os lembretes de medicação ainda estão em construção nesta versão de teste.
        </p>
      </div>
    </div>
  );
}
