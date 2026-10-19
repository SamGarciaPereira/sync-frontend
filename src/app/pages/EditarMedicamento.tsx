import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Beaker, Boxes, CalendarDays, Check, Clock, Pill, Plus, Tablets, X } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Chip } from "../components/Chip";
import { PageHeader } from "../components/PageHeader";
import { SegmentedToggle } from "../components/SegmentedToggle";
import { SelectField } from "../components/SelectField";
import { TextField } from "../components/TextField";
import {
  ALLOWED_UNITS,
  ALLOWS_FRACTION,
  ALL_DAYS,
  FORM_OPTIONS,
  STOCK_UNIT_LABELS,
  UNIT_LABELS,
  WEEK_DAYS,
  displayName,
  parseDecimal,
} from "../lib/medicationOptions";
import { useMedication } from "../lib/useMedication";
import {
  medicationService,
  type DosageUnit,
  type Medication,
  type MedicationForm,
  type MedicationUpdateInput,
} from "../../services/medications";
import { getApiErrorMessage } from "../../services/errors";

type Continuous = "sim" | "nao";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function EditarMedicamento() {
  const { id } = useParams();
  const state = useMedication(Number(id));
  const backTo = `/app/medicamentos/${id}`;

  if (state.status === "loading") {
    return (
      <>
        <PageHeader title="Editar medicação" backTo={backTo} />
        <p className="text-muted">Carregando...</p>
      </>
    );
  }

  if (state.status === "error") {
    return (
      <>
        <PageHeader title="Editar medicação" backTo="/app/medicamentos" />
        <div className="rounded-card border border-dashed border-danger/40 bg-surface/60 p-10 text-center">
          <p className="font-medium text-heading">Não foi possível abrir este medicamento</p>
          <p className="mt-1 text-sm text-muted">{state.message}</p>
        </div>
      </>
    );
  }

  return <EditForm med={state.med} />;
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-heading">
      {children}
    </label>
  );
}

function EditForm({ med }: { med: Medication }) {
  const navigate = useNavigate();
  const detailPath = `/app/medicamentos/${med.id}`;
  const catalog = med.catalogItem;

  const initialDays = new Set(med.schedules.flatMap((s) => s.daysOfWeek));

  const [name, setName] = useState(med.customName);
  const [nickname, setNickname] = useState(med.nickname ?? "");
  const [form, setForm] = useState<MedicationForm>(med.form);
  const [doseAmount, setDoseAmount] = useState(String(med.dosageAmount).replace(".", ","));
  const [doseUnit, setDoseUnit] = useState<DosageUnit>(med.dosageUnit);
  const [stock, setStock] = useState(String(med.currentStock).replace(".", ","));
  const [minStock, setMinStock] = useState(String(med.minStockAlert).replace(".", ","));
  const [conditionRule, setConditionRule] = useState(med.conditionRule ?? "");
  const [times, setTimes] = useState<string[]>(() => {
    const unique = [...new Set(med.schedules.map((s) => s.time))].sort();
    return unique.length > 0 ? unique : ["08:00"];
  });
  const [continuous, setContinuous] = useState<Continuous>(
    initialDays.size === 0 || initialDays.size === 7 ? "sim" : "nao",
  );
  const [days, setDays] = useState<Set<number>>(() =>
    initialDays.size > 0 ? initialDays : new Set(ALL_DAYS),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allowedUnits = catalog ? catalog.allowedUnits : ALLOWED_UNITS[form];
  // Schedules with different days per time are merged into one set of days on save.
  const mixedDays =
    new Set(med.schedules.map((s) => [...s.daysOfWeek].sort().join(","))).size > 1;

  const changeForm = (next: MedicationForm) => {
    setForm(next);
    if (!ALLOWED_UNITS[next].includes(doseUnit)) setDoseUnit(ALLOWED_UNITS[next][0]);
  };

  const updateTime = (index: number, value: string) =>
    setTimes((prev) => prev.map((t, i) => (i === index ? value : t)));
  const removeTime = (index: number) => setTimes((prev) => prev.filter((_, i) => i !== index));
  const addTime = () => setTimes((prev) => [...prev, "12:00"]);

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

    if (!name.trim()) {
      setError("Informe o nome do medicamento.");
      return;
    }

    const amount = parseDecimal(doseAmount);
    if (!(amount > 0)) {
      setError("Informe a dosagem: um número maior que zero (ex.: 1 ou 500).");
      return;
    }
    const allowsFraction = catalog ? catalog.allowsSplitting : ALLOWS_FRACTION[form];
    if (!allowsFraction && doseUnit === "PILULA" && !Number.isInteger(amount)) {
      setError("Este medicamento não pode ser partido. Informe uma dosagem inteira (ex.: 1, 2).");
      return;
    }

    const currentStock = parseDecimal(stock || "0");
    const minStockAlert = parseDecimal(minStock || "0");
    if (!(currentStock >= 0) || !(minStockAlert >= 0)) {
      setError("Estoque e aviso de estoque devem ser números (ex.: 30 e 5).");
      return;
    }

    const payload: MedicationUpdateInput = {
      customName: name.trim(),
      nickname: nickname.trim(),
      dosageAmount: amount,
      dosageUnit: doseUnit,
      currentStock,
      minStockAlert,
    };
    if (!catalog) payload.form = form;

    if (med.isConditional) {
      if (!conditionRule.trim()) {
        setError("Descreva quando usar este medicamento (ex.: em caso de febre).");
        return;
      }
      payload.conditionRule = conditionRule.trim();
    } else {
      const cleanTimes = [...new Set(times)].sort();
      if (cleanTimes.length === 0 || cleanTimes.some((t) => !TIME_REGEX.test(t))) {
        setError("Preencha todos os horários no formato 24h (ex.: 08:00).");
        return;
      }
      const daysOfWeek = continuous === "sim" ? ALL_DAYS : [...days].sort();
      if (daysOfWeek.length === 0) {
        setError("Escolha pelo menos um dia da semana.");
        return;
      }
      payload.schedules = cleanTimes.map((time) => ({ time, daysOfWeek }));
    }

    setSaving(true);
    try {
      await medicationService.update(med.id, payload);
      navigate(detailPath);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <PageHeader title="Editar medicação" subtitle={displayName(med)} backTo={detailPath} />

      <div className="space-y-5">
        <Card icon={Pill} title="Identificação">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="med-name">Nome</Label>
              <TextField id="med-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="med-nickname">Apelido (opcional)</Label>
              <TextField
                id="med-nickname"
                placeholder="Ex.: remédio da pressão"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card
            icon={Tablets}
            title="Tipo de medicamento"
            subtitle={catalog ? "Definido pelo catálogo." : undefined}
          >
            <SelectField
              value={form}
              onChange={(e) => changeForm(e.target.value as MedicationForm)}
              disabled={Boolean(catalog)}
              aria-label="Tipo de medicamento"
            >
              {FORM_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectField>
          </Card>

          <Card icon={Beaker} title="Dosagem" subtitle="Quanto tomar em cada dose.">
            <div className="flex gap-3">
              <TextField
                inputMode="decimal"
                value={doseAmount}
                onChange={(e) => setDoseAmount(e.target.value)}
                aria-label="Dosagem"
                className="flex-1"
              />
              <SelectField
                value={doseUnit}
                onChange={(e) => setDoseUnit(e.target.value as DosageUnit)}
                aria-label="Unidade da dosagem"
                containerClassName="w-44 shrink-0"
              >
                {allowedUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {UNIT_LABELS[unit]}
                  </option>
                ))}
              </SelectField>
            </div>
          </Card>
        </div>

        <Card icon={Boxes} title="Estoque">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="med-stock">Quantidade em casa ({STOCK_UNIT_LABELS[form]})</Label>
              <TextField
                id="med-stock"
                inputMode="decimal"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="med-min-stock">Avisar quando restar</Label>
              <TextField
                id="med-min-stock"
                inputMode="decimal"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {med.isConditional ? (
          <Card icon={Clock} title="Quando usar" subtitle="Uso “se necessário”.">
            <TextField
              value={conditionRule}
              onChange={(e) => setConditionRule(e.target.value)}
              placeholder="Ex.: em caso de febre acima de 37,8 °C"
              aria-label="Quando usar"
            />
          </Card>
        ) : (
          <>
            <Card icon={Clock} title="Horários" subtitle="Um campo para cada dose do dia.">
              <ul className="space-y-3">
                {times.map((time, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <TextField
                      type="time"
                      value={time}
                      onChange={(e) => updateTime(index, e.target.value)}
                      leftIcon={<Clock size={18} />}
                      aria-label={`Horário ${index + 1}`}
                      containerClassName="flex-1"
                      className="text-heading"
                    />
                    <button
                      type="button"
                      onClick={() => removeTime(index)}
                      disabled={times.length === 1}
                      aria-label={`Remover horário ${index + 1}`}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <X size={18} />
                    </button>
                  </li>
                ))}
              </ul>
              <Button
                variant="ghost"
                className="mt-3 px-3 py-2"
                leftIcon={<Plus size={16} />}
                onClick={addTime}
              >
                Adicionar horário
              </Button>
            </Card>

            <Card icon={CalendarDays} title="Dias da semana">
              <SegmentedToggle<Continuous>
                aria-label="Todos os dias"
                value={continuous}
                onChange={setContinuous}
                options={[
                  { value: "sim", label: "Todos os dias" },
                  { value: "nao", label: "Dias específicos" },
                ]}
              />
              {continuous === "nao" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {WEEK_DAYS.map(({ value, label }) => (
                    <Chip
                      key={value}
                      active={days.has(value)}
                      onClick={() => toggleDay(value)}
                      className="min-w-12 flex-1 sm:flex-none"
                    >
                      {label}
                    </Chip>
                  ))}
                </div>
              )}
              {mixedDays && (
                <p className="mt-3 text-sm text-muted">
                  Os horários deste medicamento tinham dias diferentes. Ao salvar, todos os
                  horários passam a usar os dias escolhidos aqui.
                </p>
              )}
            </Card>
          </>
        )}

        {error && (
          <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            type="submit"
            size="lg"
            disabled={saving}
            leftIcon={<Check size={20} />}
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate(detailPath)}>
            Cancelar
          </Button>
        </div>
      </div>
    </form>
  );
}
