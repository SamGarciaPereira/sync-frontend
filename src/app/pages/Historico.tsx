import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlarmClock,
  CalendarCheck,
  Check,
  History,
  Loader2,
  RotateCcw,
  Siren,
  Trash2,
} from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { IconBadge } from "../components/IconBadge";
import {
  historyService,
  type HistoryEvent,
  type HistorySummary,
  type HistorySummaryItem,
} from "../../services/history";
import { getApiErrorMessage } from "../../services/errors";

type Status = "loading" | "ready" | "error";

const PAGE_SIZE = 30;

/** "Hoje às 08:02", "Ontem às 20:00" ou "12/11/2026 às 08:00". */
function formatWhen(iso: string): string {
  const date = new Date(iso);
  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86_400_000);

  if (days === 0) return `Hoje às ${time}`;
  if (days === 1) return `Ontem às ${time}`;
  return `${date.toLocaleDateString("pt-BR")} às ${time}`;
}

/** Icon, title and description of each timeline entry. */
function describeEvent(event: HistoryEvent): { icon: LucideIcon; title: string; detail: string } {
  const name = event.medicationName ?? "Medicamento";
  const reminder = event.scheduledTime ? `lembrete das ${event.scheduledTime}` : null;
  const join = (...parts: (string | null)[]) => parts.filter(Boolean).join(" · ");

  switch (event.type) {
    case "DOSE_TAKEN":
      return { icon: Check, title: "Dose tomada", detail: join(name, event.dosageLabel, reminder) };
    case "ALARM":
      return { icon: AlarmClock, title: "Alarme disparado", detail: join(name, reminder) };
    case "SOS_CALL":
      return { icon: Siren, title: "Ligação SOS", detail: "Ligação de emergência realizada." };
    case "MEDICATION_FINISHED":
      return event.finishedReason === "REMOVED"
        ? { icon: Trash2, title: "Medicamento removido", detail: join(name, event.dosageLabel) }
        : {
            icon: CalendarCheck,
            title: "Tratamento concluído",
            detail: join(name, event.dosageLabel),
          };
  }
}

export function Historico() {
  const [summary, setSummary] = useState<HistorySummary | null>(null);
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<Status>("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    historyService
      .list({ type: "all", limit: PAGE_SIZE })
      .then((page) => {
        if (ignore) return;
        setSummary(page.summary);
        setEvents(page.events);
        setHasMore(page.hasMore);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setLoadError(getApiErrorMessage(err));
        setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const retry = () => {
    setStatus("loading");
    setLoadError(null);
    setReloadKey((k) => k + 1);
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const page = await historyService.list({
        type: "all",
        limit: PAGE_SIZE,
        offset: events.length,
      });
      setEvents((prev) => [...prev, ...page.events]);
      setHasMore(page.hasMore);
    } catch (err) {
      setLoadError(getApiErrorMessage(err));
      setStatus("error");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">Histórico</h1>
        <p className="mt-1.5 text-muted">
          Acompanhe as doses tomadas, os alarmes e os medicamentos já terminados.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Check}
          title="Última dose tomada"
          item={summary?.lastDose}
          loading={status === "loading" && !summary}
        />
        <SummaryCard
          icon={AlarmClock}
          title="Último alarme"
          item={summary?.lastAlarm}
          loading={status === "loading" && !summary}
        />
        {/* TODO(SOS): o botão SOS ainda está em desenvolvimento. Quando ele passar a
            registrar as ligações na API, `lastSos` vem preenchido e o aviso some. */}
        <SummaryCard
          icon={Siren}
          title="Última ligação SOS"
          item={summary?.lastSos}
          loading={status === "loading" && !summary}
          emptyTitle="Em breve"
          emptyText="O botão SOS ainda está em desenvolvimento."
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-heading">Eventos</h2>

        {status === "loading" && (
          <div className="rounded-card border border-surface-border bg-surface/60 p-10 text-center text-muted">
            Carregando histórico...
          </div>
        )}

        {status === "error" && (
          <div className="rounded-card border border-dashed border-danger/40 bg-surface/60 p-10 text-center">
            <p className="font-medium text-heading">Não foi possível carregar o histórico</p>
            <p className="mt-1 text-sm text-muted">{loadError}</p>
            <Button
              variant="outline"
              className="mt-4"
              leftIcon={<RotateCcw size={16} />}
              onClick={retry}
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {status === "ready" &&
          (events.length === 0 ? (
            <div className="flex flex-col items-center rounded-card border border-dashed border-surface-border bg-surface/60 p-10 text-center">
              <IconBadge icon={History} size="lg" />
              <p className="mt-4 font-semibold text-heading">Nenhum registro por aqui</p>
              <p className="mt-1 max-w-sm text-sm text-muted">
                As doses confirmadas e os alarmes vão aparecer nesta lista.
              </p>
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {events.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </ul>

              {hasMore && (
                <div className="flex justify-center pt-1">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loadingMore}
                    leftIcon={
                      loadingMore ? <Loader2 size={18} className="animate-spin" /> : undefined
                    }
                  >
                    {loadingMore ? "Carregando..." : "Carregar mais"}
                  </Button>
                </div>
              )}
            </>
          ))}
      </section>
    </div>
  );
}

function SummaryCard({
  icon,
  title,
  item,
  loading,
  emptyTitle = "Nenhum registro",
  emptyText,
}: {
  icon: LucideIcon;
  title: string;
  item: HistorySummaryItem | null | undefined;
  loading: boolean;
  emptyTitle?: string;
  emptyText?: string;
}) {
  return (
    <Card icon={icon} title={title}>
      {loading ? (
        <p className="text-sm text-muted">Carregando...</p>
      ) : item ? (
        <>
          <p className="text-lg font-bold text-heading">{formatWhen(item.occurredAt)}</p>
          {item.medicationName && (
            <p className="truncate text-sm text-muted">{item.medicationName}</p>
          )}
        </>
      ) : (
        <>
          <p className="text-lg font-bold text-heading">{emptyTitle}</p>
          {emptyText && <p className="text-sm text-muted">{emptyText}</p>}
        </>
      )}
    </Card>
  );
}

function EventItem({ event }: { event: HistoryEvent }) {
  const { icon, title, detail } = describeEvent(event);
  return (
    <li className="flex items-start gap-3 rounded-card border border-surface-border bg-surface p-4 shadow-card">
      <IconBadge icon={icon} size="lg" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="font-semibold text-heading">{title}</p>
          <time dateTime={event.occurredAt} className="text-sm text-muted">
            {formatWhen(event.occurredAt)}
          </time>
        </div>
        <p className="text-sm text-muted">{detail}</p>
      </div>
    </li>
  );
}
