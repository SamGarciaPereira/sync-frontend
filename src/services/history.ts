import { api } from "./api";

export type HistoryFilter = "all" | "doses" | "alarms" | "sos" | "finished";

export type HistoryEventType =
  | "DOSE_TAKEN"
  | "ALARM"
  | "SOS_CALL"
  | "MEDICATION_FINISHED";

export interface HistoryEvent {
  id: string;
  type: HistoryEventType;
  occurredAt: string;
  medicationId: number | null;
  medicationName: string | null;
  dosageLabel: string | null;
  scheduledTime: string | null; // "HH:mm"
  /** Only for MEDICATION_FINISHED: treatment ended or removed by the user. */
  finishedReason: "COMPLETED" | "REMOVED" | null;
}

export interface HistorySummaryItem {
  occurredAt: string;
  medicationName: string | null;
  scheduledTime: string | null;
}

export interface HistorySummary {
  lastDose: HistorySummaryItem | null;
  lastAlarm: HistorySummaryItem | null;
  /** Always null until the SOS button exists and starts recording calls. */
  lastSos: HistorySummaryItem | null;
}

export interface HistoryPage {
  summary: HistorySummary;
  events: HistoryEvent[];
  hasMore: boolean;
}

export interface HistoryParams {
  type: HistoryFilter;
  /** Start of the period (omit for the whole history). */
  from?: Date;
  limit?: number;
  offset?: number;
}

/** Calls to the API's /history routes. */
export const historyService = {
  /** Summary + one page of the timeline, newest first. */
  async list({ type, from, limit, offset }: HistoryParams) {
    const res = await api.get<HistoryPage>("/history", {
      params: { type, from: from?.toISOString(), limit, offset },
    });
    return res.data;
  },

  /** Downloads the PDF report for the given filter and period. */
  async downloadReport({ type, from }: Pick<HistoryParams, "type" | "from">) {
    const res = await api.get<Blob>("/history/report", {
      params: { type, from: from?.toISOString() },
      responseType: "blob",
    });

    const url = URL.createObjectURL(res.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `historico-sync-${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
