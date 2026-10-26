import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CalendarDays, Check, Clock, Pill } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Chip } from "../components/Chip";
import { PageHeader } from "../components/PageHeader";
import { SegmentedToggle } from "../components/SegmentedToggle";
import { TextField } from "../components/TextField";
import {
  ALL_DAYS,
  FORM_LABELS,
  WEEK_DAYS,
  buildDailyTimes,
  clearDraft,
  formatDose,
  loadDraft,
} from "../lib/medicationOptions";
import { medicationService } from "../../services/medications";
import { getApiErrorMessage } from "../../services/errors";

type Continuous = "sim" | "nao";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function QuandoTomar() {
  const navigate = useNavigate();
  const [draft] = useState(loadDraft);
  const [everyHours, setEveryHours] = useState("8");
  const [continuous, setContinuous] = useState<Continuous>("sim");
  const [days, setDays] = useState<Set<number>>(() => new Set([1, 2, 3, 4, 5]));
  const [firstDose, setFirstDose] = useState("08:00");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hours = Number(everyHours);
  const validHours = Number.isInteger(hours) && hours >= 1 && hours <= 24;
  const validTime = TIME_REGEX.test(firstDose);

  const times = useMemo(
    () => (validHours && validTime ? buildDailyTimes(firstDose, hours) : []),
    [firstDose, hours, validHours, validTime],
  );

  // Opened directly (or after a reload without the first step): restart the flow.
  if (!draft) return <Navigate to="/app/cadastrar" replace />;

  const toggleDay = (value: number) =>
    setDays((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validHours) {
      setError("O intervalo deve ser um número inteiro de 1 a 24 horas.");
      return;
    }
    if (!validTime) {
      setError("Informe o horário da primeira dose (ex.: 08:00).");
      return;
    }
    const daysOfWeek = continuous === "sim" ? ALL_DAYS : [...days].sort();
    if (daysOfWeek.length === 0) {
      setError("Escolha pelo menos um dia da semana.");
      return;
    }

    setSaving(true);
    try {
      await medicationService.create({
        catalogId: draft.catalogItem?.id,
        customName: draft.catalogItem ? undefined : draft.name,
        form: draft.form,
        dosageAmount: draft.dosageAmount,
        dosageUnit: draft.dosageUnit,
        currentStock: draft.currentStock,
        schedules: times.map((time) => ({ time, daysOfWeek })),
      });
      clearDraft();
      navigate("/app/medicamentos");
    } catch (err) {
      setError(getApiErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <PageHeader
        title="Quando tomar?"
        subtitle="Configure o intervalo e os dias em que o medicamento será tomado."
        backTo="/app/cadastrar"
      />

      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-card bg-sage/50 px-5 py-4">
          <Pill size={20} className="shrink-0 text-sage-icon" aria-hidden="true" />
          <p className="min-w-0 text-heading">
            <span className="font-semibold">{draft.name}</span>
            <span className="text-muted">
              {" "}
              · {formatDose(draft.dosageAmount, draft.dosageUnit)} ·{" "}
              {FORM_LABELS[draft.form]}
            </span>
          </p>
        </div>

        <Card icon={Clock} title="Intervalo de horas">
          <div className="flex items-center gap-3">
            <span className="text-muted">A cada</span>
            <TextField
              inputMode="numeric"
              value={everyHours}
              onChange={(e) => setEveryHours(e.target.value)}
              aria-label="Intervalo em horas"
              className="w-20 text-center"
            />
            <span className="text-muted">horas</span>
          </div>
        </Card>

        <Card
          icon={Pill}
          title="Contínuo?"
          subtitle="O medicamento deve ser tomado todos os dias?"
        >
          <SegmentedToggle<Continuous>
            aria-label="Uso contínuo"
            value={continuous}
            onChange={setContinuous}
            options={[
              { value: "sim", label: "Sim" },
              { value: "nao", label: "Não" },
            ]}
          />
        </Card>

        <Card
          icon={CalendarDays}
          title="Dias da semana"
          subtitle={
            continuous === "sim" ? "Uso contínuo: todos os dias." : "Toque para escolher os dias."
          }
        >
          <div className="flex flex-wrap gap-2">
            {WEEK_DAYS.map(({ value, label }) => (
              <Chip
                key={value}
                active={continuous === "sim" || days.has(value)}
                disabled={continuous === "sim"}
                onClick={() => toggleDay(value)}
                className="min-w-12 flex-1 disabled:cursor-default sm:flex-none"
              >
                {label}
              </Chip>
            ))}
          </div>
        </Card>

        <Card icon={Clock} title="Horário da primeira dose">
          <TextField
            type="time"
            value={firstDose}
            onChange={(e) => setFirstDose(e.target.value)}
            leftIcon={<Clock size={18} />}
            aria-label="Horário da primeira dose"
            className="text-heading"
          />
          {times.length > 0 && (
            <p className="mt-3 text-sm text-muted">
              Horários do dia ({times.length}x):{" "}
              <span className="font-medium text-heading">{times.join(" · ")}</span>
            </p>
          )}
        </Card>

        {error && (
          <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={saving}
          leftIcon={<Check size={20} />}
        >
          {saving ? "Salvando..." : "Salvar medicação"}
        </Button>
      </div>
    </form>
  );
}
