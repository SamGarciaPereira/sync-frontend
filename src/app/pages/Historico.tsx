import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlarmClock,
  CalendarCheck,
  Check,
  FileDown,
  History,
  Loader2,
  RotateCcw,
  Siren,
  Trash2,
} from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Chip } from "../components/Chip";
import { IconBadge } from "../components/IconBadge";
import { SelectField } from "../components/SelectField";
import {
  historyService,
  type HistoryEvent,
  type HistoryFilter,
  type HistorySummary,
  type HistorySummaryItem,
} from "../../services/history";
import { getApiErrorMessage } from "../../services/errors";

type Status = "loading" | "ready" | "error";

const PAGE_SIZE = 30;

const FILTERS: { value: HistoryFilter; label: string }[] = [
  { value: "all", label: "Tudo" },
  { value: "doses", label: "Doses tomadas" },
  { value: "alarms", label: "Alarmes" },
  { value: "sos", label: "SOS" },
  { value: "finished", label: "Medicamentos terminados" },
];

type Period = "7" | "30" | "90" | "all";

const PERIODS: { value: Period; label: string }[] = [
  { value: "7", label: "Últimos 7 dias" },
  { value: "30", label: "Últimos 30 dias" },
  { value: "90", label: "Últimos 90 dias" },
  { value: "all", label: "Todo o período" },
];

/** Start of the selected period (midnight, N days ago); undefined = everything. */
function periodStart(period: Period): Date | undefined {
  if (period === "all") return undefined;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - Number(period));
  return start;
}

/** "Aviso enviado a 2 de 3 contatos" — result of the SOS WhatsApp alert. */
function sosDetail(item: { recipientsCount: number | null; sentCount: number | null }) {
  if (item.recipientsCount === null || item.sentCount === null) return null;
  const contacts = item.recipientsCount === 1 ? "contato" : "contatos";
  return `Aviso enviado a ${item.sentCount} de ${item.recipientsCount} ${contacts}`;
}

/** Empty-state text for each filter. */
function emptyState(filter: HistoryFilter): { title: string; text: string } {
  switch (filter) {
    case "sos":
      return {
        title: "Nenhum pedido de ajuda",
        text: "Os acionamentos do botão SOS neste período aparecem aqui.",
      };
    case "finished":
      return {
        title: "Nenhum medicamento terminado",
        text: "Tratamentos concluídos e medicamentos removidos neste período aparecem aqui.",
      };
    case "doses":
      return {
        title: "Nenhuma dose registrada",
        text: "As doses confirmadas com “Tomei” neste período aparecem aqui.",
      };
    case "alarms":
      return {
        title: "Nenhum alarme registrado",
        text: "Os lembretes disparados neste período aparecem aqui.",
      };
    default:
      return {
        title: "Nenhum registro por aqui",
        text: "As doses, os alarmes e os pedidos de ajuda deste período vão aparecer nesta lista.",
      };
  }
}

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
      return {
        icon: Siren,
        title: "Pedido de ajuda (SOS)",
        detail: sosDetail(event) ?? "Botão SOS acionado.",
      };
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
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [period, setPeriod] = useState<Period>("30");
  const [summary, setSummary] = useState<HistorySummary | null>(null);
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<Status>("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    historyService
      .list({ type: filter, from: periodStart(period), limit: PAGE_SIZE })
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
  }, [filter, period, reloadKey]);

  const changeFilter = (next: HistoryFilter) => {
    if (next === filter) return;
    setStatus("loading");
    setLoadError(null);
    setFilter(next);
  };

  const changePeriod = (next: Period) => {
    setStatus("loading");
    setLoadError(null);
    setPeriod(next);
  };

  const retry = () => {
    setStatus("loading");
    setLoadError(null);
    setReloadKey((k) => k + 1);
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const page = await historyService.list({
        type: filter,
        from: periodStart(period),
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

  const downloadReport = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      await historyService.downloadReport({ type: filter, from: periodStart(period) });
    } catch {
      setDownloadError("Não foi possível gerar o relatório em PDF. Tente novamente.");
    } finally {
      setDownloading(false);
    }
  };

  const empty = emptyState(filter);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">Histórico</h1>
          <p className="mt-1.5 text-muted">
            Acompanhe as doses tomadas, os alarmes, os pedidos de ajuda e os medicamentos já
            terminados.
          </p>
        </div>
        <Button
          variant="outline"
          className="shrink-0"
          onClick={downloadReport}
          disabled={downloading}
          leftIcon={
            downloading ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />
          }
        >
          {downloading ? "Gerando PDF..." : "Baixar PDF"}
        </Button>
      </header>

      {downloadError && (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {downloadError}
        </p>
      )}

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
        <SummaryCard
          icon={Siren}
          title="Último SOS"
          item={summary?.lastSos}
          loading={status === "loading" && !summary}
        />
      </div>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-heading">Eventos</h2>
          <SelectField
            aria-label="Escolher o período"
            value={period}
            onChange={(e) => changePeriod(e.target.value as Period)}
            disabled={loadingMore}
            containerClassName="w-full sm:w-52"
          >
            {PERIODS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>
        </div>

        <div role="group" aria-label="Filtrar eventos" className="flex flex-wrap gap-2">
          {FILTERS.map(({ value, label }) => (
            <Chip
              key={value}
              active={filter === value}
              onClick={() => changeFilter(value)}
              disabled={loadingMore}
            >
              {label}
            </Chip>
          ))}
        </div>

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
              <IconBadge icon={filter === "sos" ? Siren : History} size="lg" />
              <p className="mt-4 font-semibold text-heading">{empty.title}</p>
              <p className="mt-1 max-w-sm text-sm text-muted">{empty.text}</p>
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
}: {
  icon: LucideIcon;
  title: string;
  item: HistorySummaryItem | null | undefined;
  loading: boolean;
}) {
  const detail = item ? (item.medicationName ?? sosDetail(item)) : null;

  return (
    <Card icon={icon} title={title}>
      {loading ? (
        <p className="text-sm text-muted">Carregando...</p>
      ) : item ? (
        <>
          <p className="text-lg font-bold text-heading">{formatWhen(item.occurredAt)}</p>
          {detail && <p className="text-sm text-muted">{detail}</p>}
        </>
      ) : (
        <p className="text-lg font-bold text-heading">Nenhum registro</p>
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
