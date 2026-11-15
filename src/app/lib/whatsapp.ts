import type { Coordinates } from "./geolocation";

/** Monta a URL wa.me (fallback manual, quando o envio automático falha). */
export function whatsappUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * Mensagem de socorro para o fallback manual — mesmo espírito da montada no
 * backend (src/models/sosEvent.ts).
 */
export function buildSosMessage(
  userName: string,
  coords: Coordinates | null,
): string {
  const name = userName?.trim() || "Um usuário do SYNC";
  const lines = [
    `🚨 [SYNC] ${name} está pedindo ajuda.`,
    "Por favor, entre em contato ou vá até a pessoa o quanto antes.",
  ];
  if (coords) {
    lines.push(
      `📍 Localização: https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
    );
  }
  return lines.join("\n");
}

/** Formata um telefone "+5541999998888" para exibição "(41) 99999-8888". */
export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^55/, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}
