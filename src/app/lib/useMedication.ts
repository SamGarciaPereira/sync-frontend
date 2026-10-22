import { useEffect, useState } from "react";
import { medicationService, type Medication } from "../../services/medications";
import { getApiErrorMessage } from "../../services/errors";

export type MedicationState =
  | { status: "loading" }
  | { status: "ready"; med: Medication }
  | { status: "error"; message: string };

/** Loads one medication (GET /medications/:id). */
export function useMedication(id: number): MedicationState {
  const [state, setState] = useState<MedicationState>({ status: "loading" });

  useEffect(() => {
    let ignore = false;
    medicationService
      .get(id)
      .then((med) => {
        if (!ignore) setState({ status: "ready", med });
      })
      .catch((err: unknown) => {
        if (!ignore) setState({ status: "error", message: getApiErrorMessage(err) });
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  return state;
}
