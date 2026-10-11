import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Clock, Eye, Pencil, Pill, Plus, Trash2 } from "lucide-react";
import { Button } from "../components/Button";
import { IconBadge } from "../components/IconBadge";
import { SearchInput } from "../components/SearchInput";
import { cn } from "../lib/cn";
import { medications as seed, type Medication } from "../data/medications";

export function MeusMedicamentos() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Medication[]>(seed);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.principle?.toLowerCase().includes(q) ?? false),
    );
  }, [items, query]);

  const handleDelete = (med: Medication) => {
    if (window.confirm(`Remover ${med.name} da sua lista?`)) {
      setItems((prev) => prev.filter((m) => m.id !== med.id));
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

      {filtered.length === 0 ? (
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
            <MedicationCard key={med.id} med={med} onDelete={() => handleDelete(med)} />
          ))}
        </ul>
      )}

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

function MedicationCard({ med, onDelete }: { med: Medication; onDelete: () => void }) {
  return (
    <li className="rounded-card border border-surface-border bg-surface p-4 shadow-card">
      <div className="flex items-start gap-3">
        <IconBadge icon={Pill} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-semibold text-heading">{med.name}</h3>
            <ChevronRight size={20} className="mt-0.5 shrink-0 text-faint" aria-hidden="true" />
          </div>
          <p className="text-sm text-muted">
            {med.dose} · {med.form}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted">
              <Clock size={15} aria-hidden="true" />
              {med.frequencyLabel} · {med.times.join(" / ")}
            </span>
            <div className="flex items-center gap-0.5">
              <ActionButton label={`Ver ${med.name}`} icon={Eye} />
              <ActionButton label={`Editar ${med.name}`} icon={Pencil} />
              <ActionButton
                label={`Remover ${med.name}`}
                icon={Trash2}
                onClick={onDelete}
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
  danger,
}: {
  label: string;
  icon: typeof Eye;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40",
        danger
          ? "text-danger hover:bg-danger/10"
          : "text-muted hover:bg-sage/60 hover:text-sage-icon",
      )}
    >
      <Icon size={18} />
    </button>
  );
}
