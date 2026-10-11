export interface Medication {
  id: string;
  name: string;
  /** Princípio ativo / apelido, usado na busca. */
  principle?: string;
  dose: string; // ex.: "50 mg"
  form: string; // ex.: "Comprimido" | "Cápsula"
  frequencyLabel: string; // ex.: "1x ao dia"
  times: string[]; // ex.: ["08:00"]
}

export const medications: Medication[] = [
  {
    id: "losartana",
    name: "Losartana",
    principle: "Losartana potássica",
    dose: "50 mg",
    form: "Comprimido",
    frequencyLabel: "1x ao dia",
    times: ["08:00"],
  },
  {
    id: "paracetamol",
    name: "Paracetamol",
    principle: "Paracetamol",
    dose: "500 mg",
    form: "Comprimido",
    frequencyLabel: "3x ao dia",
    times: ["08:00", "14:00", "20:00"],
  },
  {
    id: "omeprazol",
    name: "Omeprazol",
    principle: "Omeprazol",
    dose: "20 mg",
    form: "Cápsula",
    frequencyLabel: "1x ao dia",
    times: ["07:00"],
  },
  {
    id: "atorvastatina",
    name: "Atorvastatina",
    principle: "Atorvastatina cálcica",
    dose: "40 mg",
    form: "Comprimido",
    frequencyLabel: "1x ao dia",
    times: ["21:00"],
  },
  {
    id: "vitamina-d",
    name: "Vitamina D",
    principle: "Colecalciferol",
    dose: "2000 UI",
    form: "Comprimido",
    frequencyLabel: "1x ao dia",
    times: ["10:00"],
  },
];
