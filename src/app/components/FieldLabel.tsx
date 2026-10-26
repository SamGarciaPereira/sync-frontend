import type { ReactNode } from "react";

/** Visible label above a form field. */
export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block font-medium text-heading">
      {children}
    </label>
  );
}
