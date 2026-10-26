import { api } from "./api";

/** Same values as the `MedicationForm` enum in the API (Prisma schema). */
export type MedicationForm =
  | "TABLET"
  | "CAPSULE"
  | "DROPS"
  | "LIQUID"
  | "INJECTION"
  | "INHALER"
  | "TOPICAL"
  | "PATCH";

/** Same values as the `DosageUnit` enum in the API (Prisma schema). */
export type DosageUnit = "PILULA" | "MG" | "ML" | "GOTAS" | "UI" | "JATO" | "APLICACAO";

export interface MedicationSchedule {
  id: number;
  medicationId: number;
  time: string; // "HH:mm"
  daysOfWeek: number[]; // 0 = domingo ... 6 = sábado
}

export interface CatalogItemBase {
  id: number;
  name: string;
  activeIngredient: string | null;
  concentration: string | null;
  form: MedicationForm;
  defaultUnit: DosageUnit;
  allowedUnits: DosageUnit[];
  allowsSplitting: boolean;
  requiresFasting: boolean;
  defaultInstructions: string | null;
}

/** Catalog search result: the base item plus hints for the form. */
export interface CatalogItem extends CatalogItemBase {
  uiConfig: {
    allowedUnits: DosageUnit[];
    allowsSplitting: boolean;
    lockFormSelection: boolean;
    showStockInUnitsOf: DosageUnit;
  };
}

export interface Medication {
  id: number;
  userId: number;
  catalogId: number | null;
  customName: string;
  nickname: string | null;
  form: MedicationForm;
  dosageAmount: number;
  dosageUnit: DosageUnit;
  isConditional: boolean;
  conditionRule: string | null;
  startDate: string;
  endDate: string | null;
  notes: string | null;
  visualDescription: string | null;
  currentStock: number;
  minStockAlert: number;
  alertsEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  catalogItem: CatalogItemBase | null;
  schedules: MedicationSchedule[];
}

export interface ScheduleInput {
  time: string;
  daysOfWeek?: number[];
}

/** The owner is always the logged-in user (taken from the session by the API). */
export interface MedicationCreateInput {
  catalogId?: number;
  customName?: string;
  nickname?: string;
  form?: MedicationForm;
  dosageAmount: number;
  dosageUnit: DosageUnit;
  isConditional?: boolean;
  conditionRule?: string;
  currentStock?: number;
  minStockAlert?: number;
  schedules?: ScheduleInput[];
}

export type MedicationUpdateInput = Partial<MedicationCreateInput> & {
  isActive?: boolean;
};

/** Calls to the API's /medications routes. */
export const medicationService = {
  async searchCatalog(query = "") {
    const res = await api.get<CatalogItem[]>("/medications", {
      params: { catalog: "true", q: query },
    });
    return res.data;
  },

  /** Active medications of the logged-in user. */
  async list() {
    const res = await api.get<Medication[]>("/medications");
    return res.data;
  },

  async get(id: number) {
    const res = await api.get<Medication>(`/medications/${id}`);
    return res.data;
  },

  async create(data: MedicationCreateInput) {
    const res = await api.post<Medication>("/medications", data);
    return res.data;
  },

  async update(id: number, data: MedicationUpdateInput) {
    const res = await api.patch<Medication>(`/medications/${id}`, data);
    return res.data;
  },

  async remove(id: number) {
    const res = await api.delete<Medication>(`/medications/${id}`);
    return res.data;
  },
};
