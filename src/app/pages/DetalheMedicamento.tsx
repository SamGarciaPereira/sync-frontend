import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Beaker,
  Boxes,
  CalendarDays,
  Clock,
  Info,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { cn } from "../lib/cn";
import {
  FORM_LABELS,
  STOCK_UNIT_LABELS,
  describeSchedules,
  displayName,
  formatDate,
  formatDose,
} from "../lib/medicationOptions";
import { useMedication } from "../lib/useMedication";
import { medicationService, type Medication } from "../../services/medications";
import { getApiErrorMessage } from "../../services/errors";

export function DetalheMedicamento() {
  const { id } = useParams();
  const state = useMedication(Number(id));

  if (state.status === "loading") {
    return (
      <>
        <PageHeader title="Medicamento" backTo="/app/medicamentos" />
        <p className="text-muted">Carregando...</p>
      </>
    );
  }

  if (state.status === "error") {
    return (
      <>
        <PageHeader title="Medicamento" backTo="/app/medicamentos" />
        <div className="rounded-card border border-dashed border-danger/40 bg-surface/60 p-10 text-center">
          <p className="font-medium text-heading">Não foi possível abrir este medicamento</p>
          <p className="mt-1 text-sm text-muted">{state.message}</p>
        </div>
      </>
    );
  }

  return <Detalhe med={state.med} />;
}

function Detalhe({ med }: { med: Medication }) {
  const navigate = useNavigate();
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const name = displayName(med);
  const { times, daysLabel } = describeSchedules(med.schedules);
  const lowStock = med.currentStock <= med.minStockAlert;
  const catalog = med.catalogItem;

  const handleRemove = async () => {
    if (!window.confirm(`Remover ${name} da sua lista?`)) return;
    setError(null);
    setRemoving(true);
    try {
      await medicationService.remove(med.id);
      navigate("/app/medicamentos");
    } catch (err) {
      setError(getApiErrorMessage(err));
      setRemoving(false);
    }
  };

  const subtitle = med.nickname
    ? med.customName
    : catalog?.activeIngredient
      ? `${catalog.activeIngredient}${catalog.concentration ? ` · ${catalog.concentration}` : ""}`
      : undefined;

  return (
    <div>
      <PageHeader title={name} subtitle={subtitle} backTo="/app/medicamentos" />

      <div className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card icon={Beaker} title="Dose">
            <p className="text-2xl font-bold text-heading">
              {formatDose(med.dosageAmount, med.dosageUnit)}
            </p>
            <p className="text-sm text-muted">{FORM_LABELS[med.form]}</p>
          </Card>

          <Card icon={Boxes} title="Estoque">
            <p
              className={cn(
                "inline-flex items-center gap-2 text-2xl font-bold",
                lowStock ? "text-danger" : "text-heading",
              )}
            >
              {lowStock && <AlertTriangle size={20} aria-hidden="true" />}
              {med.currentStock.toLocaleString("pt-BR")} {STOCK_UNIT_LABELS[med.form]}
            </p>
            <p className="text-sm text-muted">
              {lowStock
                ? "Estoque baixo: hora de repor."
                : `Aviso quando restar ${med.minStockAlert.toLocaleString("pt-BR")}.`}
            </p>
          </Card>
        </div>

        <Card icon={Clock} title="Quando tomar">
          {med.isConditional ? (
            <p className="text-heading">
              Se necessário
              {med.conditionRule && <span className="text-muted"> · {med.conditionRule}</span>}
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {times.map((time) => (
                  <span
                    key={time}
                    className="rounded-xl bg-sage/60 px-4 py-2 text-lg font-semibold text-heading"
                  >
                    {time}
                  </span>
                ))}
              </div>
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted">
                <CalendarDays size={15} aria-hidden="true" />
                {daysLabel}
              </p>
            </>
          )}
        </Card>

        <Card icon={Info} title="Informações">
          <dl className="space-y-2 text-sm">
            {catalog?.requiresFasting && (
              <InfoRow label="Atenção" value="Tomar em jejum" highlight />
            )}
            {catalog?.defaultInstructions && (
              <InfoRow label="Como usar" value={catalog.defaultInstructions} />
            )}
            {med.notes && <InfoRow label="Observações" value={med.notes} />}
            {med.visualDescription && (
              <InfoRow label="Aparência" value={med.visualDescription} />
            )}
            <InfoRow label="Em uso desde" value={formatDate(med.startDate)} />
            {med.endDate && <InfoRow label="Até" value={formatDate(med.endDate)} />}
            <InfoRow label="Origem" value={catalog ? "Catálogo" : "Cadastro manual"} />
          </dl>
        </Card>

        {error && (
          <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            size="lg"
            leftIcon={<Pencil size={18} />}
            onClick={() => navigate(`/app/medicamentos/${med.id}/editar`)}
          >
            Editar
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-danger hover:bg-danger/10"
            leftIcon={<Trash2 size={18} />}
            disabled={removing}
            onClick={handleRemove}
          >
            {removing ? "Removendo..." : "Remover"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
      <dt className="w-32 shrink-0 font-medium text-heading">{label}</dt>
      <dd className={highlight ? "font-medium text-danger" : "text-muted"}>{value}</dd>
    </div>
  );
}
