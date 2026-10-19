import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Beaker, Boxes, Pill, Plus, Tablets } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Chip } from "../components/Chip";
import { PageHeader } from "../components/PageHeader";
import { SearchInput } from "../components/SearchInput";
import { SelectField } from "../components/SelectField";
import { TextField } from "../components/TextField";

const suggestions = ["Paracetamol", "Losartana", "Omeprazol", "Atorvastatina", "AAS"];

export function CadastrarMedicacao() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("Comprimido");
  const [doseAmount, setDoseAmount] = useState("");
  const [doseUnit, setDoseUnit] = useState("mg");
  const [quantity, setQuantity] = useState("");
  const [quantityUnit, setQuantityUnit] = useState("comprimidos");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/app/cadastrar/quando-tomar");
  };

  return (
    <form onSubmit={handleSubmit}>
      <PageHeader
        title="Cadastrar medicação"
        subtitle="Adicione um novo medicamento ao sistema."
        backTo="/app/medicamentos"
      />

      <div className="space-y-5">
        <Card
          icon={Pill}
          title="Pesquisar medicamento"
          subtitle="Busque pelo nome do princípio ativo ou apelido."
        >
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Digite o nome do princípio ativo ou apelido..."
            aria-label="Pesquisar medicamento"
          />
          <p className="mt-4 text-sm font-medium text-heading">Sugestões</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((name) => (
              <Chip key={name} variant="soft" onClick={() => setSearch(name)}>
                {name}
              </Chip>
            ))}
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card
            icon={Tablets}
            title="Tipo de medicamento"
            subtitle="Selecione o tipo de apresentação."
          >
            <SelectField
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-label="Tipo de medicamento"
            >
              <option>Comprimido</option>
              <option>Cápsula</option>
              <option>Gotas</option>
              <option>Xarope</option>
              <option>Injeção</option>
              <option>Pomada</option>
            </SelectField>
          </Card>

          <Card icon={Beaker} title="Dosagem" subtitle="Informe a quantidade e a unidade.">
            <div className="flex gap-3">
              <TextField
                inputMode="decimal"
                placeholder="Ex.: 500"
                value={doseAmount}
                onChange={(e) => setDoseAmount(e.target.value)}
                aria-label="Dosagem"
                className="flex-1"
              />
              <SelectField
                value={doseUnit}
                onChange={(e) => setDoseUnit(e.target.value)}
                aria-label="Unidade da dosagem"
                containerClassName="w-28 shrink-0"
              >
                <option>mg</option>
                <option>ml</option>
                <option>mcg</option>
                <option>g</option>
                <option>UI</option>
                <option>%</option>
              </SelectField>
            </div>
          </Card>
        </div>

        <Card
          icon={Boxes}
          title="Quantidade"
          subtitle="Informe a quantidade total do medicamento (ex.: caixa, comprimidos, etc)."
        >
          <div className="flex gap-3">
            <TextField
              inputMode="numeric"
              placeholder="Ex.: 30"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              aria-label="Quantidade"
              className="flex-1"
            />
            <SelectField
              value={quantityUnit}
              onChange={(e) => setQuantityUnit(e.target.value)}
              aria-label="Unidade da quantidade"
              containerClassName="w-40 shrink-0"
            >
              <option>comprimidos</option>
              <option>cápsulas</option>
              <option>ml</option>
              <option>caixas</option>
              <option>unidades</option>
            </SelectField>
          </div>
        </Card>

        <Button type="submit" size="lg" fullWidth leftIcon={<Plus size={20} />}>
          Adicionar medicação
        </Button>
      </div>
    </form>
  );
}
