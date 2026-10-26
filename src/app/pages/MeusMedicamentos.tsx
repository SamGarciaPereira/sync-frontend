import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ChevronRight,
  Clock,
  Eye,
  Pencil,
  Pill,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "../components/Button";
import { IconBadge } from "../components/IconBadge";
import { SearchInput } from "../components/SearchInput";
import { cn } from "../lib/cn";
import {
  FORM_LABELS,
  STOCK_UNIT_LABELS,
  describeSchedules,
  displayName,
  formatDose,
} from "../lib/medicationOptions";
import { medicationService, type Medication } from "../../services/medications";
import { getApiErrorMessage } from "../../services/errors";

type Status = "loading" | "ready" | "error";

export function MeusMedicamentos() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Medication[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let ignore = false;

    medicationService
      .list()
      .then((data) => {
        if (ignore) return;
        setItems(data);
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((m) =>
      [m.customName, m.nickname, m.catalogItem?.name, m.catalogItem?.activeIngredient].some(
        (text) => text?.toLowerCase().includes(q),
      ),
    );
  }, [items, query]);

  const handleDelete = async (med: Medication) => {
    if (!window.confirm(`Remover ${displayName(med)} da sua lista?`)) return;

    setActionError(null);
    setRemovingId(med.id);
    try {
      await medicationService.remove(med.id);
      setItems((prev) => prev.filter((m) => m.id !== med.id));
    } catch (err) {
      setActionError(getApiErrorMessage(err));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">
          Meus medicamentos
        </h1>
        <p className="mt-1.5 text-muted">Gerencie seus medicamentos cadastrados.</p>
      </header>

      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Buscar por nome ou princípio ativo..."
        aria-label="Buscar medicamentos"
      />

      {actionError && (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {actionError}
        </p>
      )}

      {status === "loading" && (
        <div className="rounded-card border border-surface-border bg-surface/60 p-10 text-center text-muted">
          Carregando medicamentos...
        </div>
      )}

      {status === "error" && (
        <div className="rounded-card border border-dashed border-danger/40 bg-surface/60 p-10 text-center">
          <p className="font-medium text-heading">Não foi possível carregar seus medicamentos</p>
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
        (filtered.length === 0 ? (
          <div className="rounded-card border border-dashed border-surface-border bg-surface/60 p-10 text-center">
            <p className="font-medium text-heading">Nenhum medicamento encontrado</p>
            <p className="mt-1 text-sm text-muted">
              {query
                ? "Tente outro nome ou princípio ativo."
                : "Adicione seu primeiro medicamento para começar."}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((med) => (
              <MedicationCard
                key={med.id}
                med={med}
                removing={removingId === med.id}
                onDelete={() => handleDelete(med)}
              />
            ))}
          </ul>
        ))}

      <div className="flex justify-end pt-1">
        <Button
          leftIcon={<Plus size={18} />}
          className="rounded-full"
          onClick={() => navigate("/app/cadastrar")}
        >
          Adicionar medicação
        </Button>
      </div>
    </div>
  );
}

function MedicationCard({
  med,
  removing,
  onDelete,
}: {
  med: Medication;
  removing: boolean;
  onDelete: () => void;
}) {
  const navigate = useNavigate();
  const name = displayName(med);
  const detailPath = `/app/medicamentos/${med.id}`;
  const { times, perDay, daysLabel } = describeSchedules(med.schedules);
  const lowStock = med.currentStock <= med.minStockAlert;

  const scheduleText = med.isConditional
    ? `Se necessário${med.conditionRule ? ` · ${med.conditionRule}` : ""}`
    : `${perDay}x ao dia · ${times.join(" / ")}`;

  return (
    <li
      className={cn(
        "rounded-card border border-surface-border bg-surface p-4 shadow-card transition-opacity",
        removing && "opacity-50",
      )}
    >
      <div className="flex items-start gap-3">
        <IconBadge icon={Pill} />
        <div className="min-w-0 flex-1">
          <Link
            to={detailPath}
            className="group flex items-start justify-between gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
          >
            <h3 className="truncate font-semibold text-heading group-hover:underline">{name}</h3>
            <ChevronRight size={20} className="mt-0.5 shrink-0 text-faint" aria-hidden="true" />
          </Link>
          <p className="text-sm text-muted">
            {formatDose(med.dosageAmount, med.dosageUnit)} · {FORM_LABELS[med.form]}
          </p>
          <p
            className={cn(
              "mt-1 inline-flex items-center gap-1.5 text-sm",
              lowStock ? "font-medium text-danger" : "text-muted",
            )}
          >
            {lowStock && <AlertTriangle size={15} aria-hidden="true" />}
            Estoque: {med.currentStock.toLocaleString("pt-BR")} {STOCK_UNIT_LABELS[med.form]}
            {lowStock && " · repor em breve"}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted">
              <Clock size={15} aria-hidden="true" />
              {scheduleText}
              {!med.isConditional && ` · ${daysLabel}`}
            </span>
            <div className="flex items-center gap-0.5">
              <ActionButton
                label={`Ver ${name}`}
                icon={Eye}
                onClick={() => navigate(detailPath)}
              />
              <ActionButton
                label={`Editar ${name}`}
                icon={Pencil}
                onClick={() => navigate(`${detailPath}/editar`)}
              />
              <ActionButton
                label={`Remover ${name}`}
                icon={Trash2}
                onClick={onDelete}
                disabled={removing}
                danger
              />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function ActionButton({
  label,
  icon: Icon,
  onClick,
  disabled,
  danger,
}: {
  label: string;
  icon: typeof Eye;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        danger
          ? "text-danger hover:bg-danger/10"
          : "text-muted hover:bg-sage/60 hover:text-sage-icon",
      )}
    >
      <Icon size={18} />
    </button>
  );
}
