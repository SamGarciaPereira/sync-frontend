import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock, Pill } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Chip } from "../components/Chip";
import { PageHeader } from "../components/PageHeader";
import { SegmentedToggle } from "../components/SegmentedToggle";
import { SelectField } from "../components/SelectField";
import { TextField } from "../components/TextField";

const weekDays = [
  { key: "seg", label: "Seg" },
  { key: "ter", label: "Ter" },
  { key: "qua", label: "Qua" },
  { key: "qui", label: "Qui" },
  { key: "sex", label: "Sex" },
  { key: "sab", label: "Sáb" },
  { key: "dom", label: "Dom" },
];

type Continuous = "sim" | "nao";

export function QuandoTomar() {
  const navigate = useNavigate();
  const [interval, setInterval] = useState("8");
  const [intervalUnit, setIntervalUnit] = useState("horas");
  const [continuous, setContinuous] = useState<Continuous>("sim");
  const [days, setDays] = useState<Set<string>>(
    () => new Set(["seg", "ter", "qua", "qui", "sex"]),
  );
  const [firstDose, setFirstDose] = useState("08:00");

  const toggleDay = (key: string) =>
    setDays((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/app/medicamentos");
  };

  return (
    <form onSubmit={handleSubmit}>
      <PageHeader
        title="Quando tomar?"
        subtitle="Configure o intervalo e os dias em que o medicamento será tomado."
        backTo="/app/cadastrar"
      />

      <div className="space-y-5">
        <Card icon={Clock} title="Intervalo de horas">
          <div className="flex items-center gap-3">
            <span className="text-muted">A cada</span>
            <TextField
              inputMode="numeric"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              aria-label="Intervalo"
              className="w-20 text-center"
            />
            <SelectField
              value={intervalUnit}
              onChange={(e) => setIntervalUnit(e.target.value)}
              aria-label="Unidade do intervalo"
              containerClassName="flex-1"
            >
              <option>horas</option>
              <option>dias</option>
              <option>semanas</option>
            </SelectField>
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

        <Card icon={CalendarDays} title="Dias da semana">
          <div className="flex flex-wrap gap-2">
            {weekDays.map(({ key, label }) => (
              <Chip
                key={key}
                active={days.has(key)}
                onClick={() => toggleDay(key)}
                className="min-w-12 flex-1 sm:flex-none"
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
        </Card>

        <Button type="submit" size="lg" fullWidth rightIcon={<ArrowRight size={20} />}>
          Continuar
        </Button>
      </div>
    </form>
  );
}
