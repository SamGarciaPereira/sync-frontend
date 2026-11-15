import { api } from "./api";

export interface EmergencyContact {
  id: number;
  userId: number;
  name: string;
  phone: string; // formato internacional, ex.: "+5541999998888"
  relationship: string | null;
  isPrimary: boolean;
  createdAt: string;
}

export interface EmergencyContactInput {
  name: string;
  phone: string;
  relationship?: string | null;
  isPrimary?: boolean;
}

export interface SosResultItem {
  contactId: number;
  name: string;
  sent: boolean;
}

export interface SosEvent {
  id: number;
  latitude: number | null;
  longitude: number | null;
  recipientsCount: number;
  sentCount: number;
  createdAt: string;
}

export interface SosResult {
  event: SosEvent;
  results: SosResultItem[];
  sentCount: number;
  message: string;
}

export interface SosCoordinates {
  latitude?: number | null;
  longitude?: number | null;
}

/** Chamadas às rotas /emergency-contacts da API (US26). */
export const emergencyService = {
  async list() {
    const res = await api.get<EmergencyContact[]>("/emergency-contacts");
    return res.data;
  },

  async create(data: EmergencyContactInput) {
    const res = await api.post<EmergencyContact>("/emergency-contacts", data);
    return res.data;
  },

  async update(id: number, data: Partial<EmergencyContactInput>) {
    const res = await api.patch<EmergencyContact>(
      `/emergency-contacts/${id}`,
      data,
    );
    return res.data;
  },

  async remove(id: number) {
    const res = await api.delete<EmergencyContact>(`/emergency-contacts/${id}`);
    return res.data;
  },
};

/** Aciona o botão de SOS (US25): o backend envia o WhatsApp aos contatos. */
export const sosService = {
  async trigger(coords: SosCoordinates = {}): Promise<SosResult> {
    const res = await api.post<SosResult>("/sos", coords);
    return res.data;
  },
};
