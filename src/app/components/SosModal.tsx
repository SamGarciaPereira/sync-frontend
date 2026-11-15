import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  AlertTriangle,
  Check,
  Loader2,
  MessageCircle,
  Siren,
  UserPlus,
  X,
} from "lucide-react";
import { Button } from "./Button";
import { useAuth } from "../auth/authContext";
import { getCurrentPositionSafe, type Coordinates } from "../lib/geolocation";
import {
  buildSosMessage,
  formatPhoneDisplay,
  whatsappUrl,
} from "../lib/whatsapp";
import {
  emergencyService,
  sosService,
  type EmergencyContact,
  type SosResult,
} from "../../services/emergency";
import { getApiErrorMessage } from "../../services/errors";

type Phase = "confirm" | "sending" | "sent" | "nocontacts" | "fallback" | "error";

export function SosModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>("confirm");
  const [result, setResult] = useState<SosResult | null>(null);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [fallbackContacts, setFallbackContacts] = useState<EmergencyContact[]>(
    [],
  );
  const [errorMsg, setErrorMsg] = useState("");

  const closable = phase !== "sending";

  async function loadFallback(onlyIds?: Set<number>) {
    try {
      let contacts = await emergencyService.list();
      if (onlyIds) contacts = contacts.filter((c) => onlyIds.has(c.id));
      if (contacts.length === 0) {
        setPhase("nocontacts");
        return;
      }
      setFallbackContacts(contacts);
      setPhase("fallback");
    } catch (err) {
      setErrorMsg(getApiErrorMessage(err));
      setPhase("error");
    }
  }

  async function handleConfirm() {
    setPhase("sending");
    const current = await getCurrentPositionSafe();
    setCoords(current);
    try {
      const res = await sosService.trigger(
        current
          ? { latitude: current.latitude, longitude: current.longitude }
          : {},
      );
      setResult(res);
      setPhase("sent");
    } catch (err) {
      const status = isAxiosError(err) ? err.response?.status : undefined;
      if (status === 400) {
        setPhase("nocontacts");
      } else if (status === 503) {
        await loadFallback();
      } else {
        setErrorMsg(getApiErrorMessage(err));
        setPhase("error");
      }
    }
  }

  const message = buildSosMessage(user?.name ?? "", coords);

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label="Pedir ajuda (SOS)"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-dark/50 p-4 backdrop-blur-sm"
    >
      <div className="relative flex w-full max-w-md flex-col rounded-card border border-surface-border bg-surface p-6 text-center shadow-card sm:p-8">
        {closable && (
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-sage/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
          >
            <X size={20} />
          </button>
        )}

        {phase === "confirm" && (
          <>
            <IconCircle tone="danger">
              <Siren size={40} className="text-danger" aria-hidden="true" />
            </IconCircle>
            <h2 className="mt-5 text-2xl font-bold text-heading">
              Pedir ajuda agora?
            </h2>
            <p className="mt-2 text-muted">
              Vamos avisar seus contatos de emergência pelo WhatsApp
              {coords === null ? " com a sua localização" : ""}, na hora.
            </p>
            <div className="mt-8 w-full space-y-3">
              <DangerButton onClick={handleConfirm} autoFocus>
                <Siren size={22} aria-hidden="true" /> Sim, pedir ajuda
              </DangerButton>
              <Button variant="ghost" fullWidth onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </>
        )}

        {phase === "sending" && (
          <div className="py-6">
            <IconCircle tone="danger">
              <Loader2
                size={40}
                className="animate-spin text-danger"
                aria-hidden="true"
              />
            </IconCircle>
            <h2 className="mt-5 text-xl font-bold text-heading">
              Enviando o pedido de ajuda…
            </h2>
            <p className="mt-2 text-muted">Pegando a localização e avisando.</p>
          </div>
        )}

        {phase === "sent" && result && (
          <SentView result={result} onClose={onClose} onFallback={loadFallback} />
        )}

        {phase === "nocontacts" && (
          <>
            <IconCircle tone="sage">
              <UserPlus size={38} className="text-sage-icon" aria-hidden="true" />
            </IconCircle>
            <h2 className="mt-5 text-xl font-bold text-heading">
              Cadastre um contato de emergência
            </h2>
            <p className="mt-2 text-muted">
              Você ainda não tem contatos para avisar. Adicione pelo menos um
              para usar o SOS.
            </p>
            <div className="mt-8 w-full space-y-3">
              <Link to="/app/contatos" onClick={onClose} className="block">
                <Button fullWidth leftIcon={<UserPlus size={20} />}>
                  Cadastrar contato
                </Button>
              </Link>
              <Button variant="ghost" fullWidth onClick={onClose}>
                Fechar
              </Button>
            </div>
          </>
        )}

        {phase === "fallback" && (
          <>
            <IconCircle tone="danger">
              <AlertTriangle
                size={38}
                className="text-danger"
                aria-hidden="true"
              />
            </IconCircle>
            <h2 className="mt-5 text-xl font-bold text-heading">
              Envio automático indisponível
            </h2>
            <p className="mt-2 text-muted">
              Não foi possível enviar sozinho agora. Toque em um contato para
              avisar pelo WhatsApp.
            </p>
            <ul className="mt-6 space-y-2 text-left">
              {fallbackContacts.map((contact) => (
                <li key={contact.id}>
                  <WhatsappLink contact={contact} message={message} />
                </li>
              ))}
            </ul>
            <Button
              variant="ghost"
              fullWidth
              className="mt-6"
              onClick={onClose}
            >
              Fechar
            </Button>
          </>
        )}

        {phase === "error" && (
          <>
            <IconCircle tone="danger">
              <AlertTriangle
                size={38}
                className="text-danger"
                aria-hidden="true"
              />
            </IconCircle>
            <h2 className="mt-5 text-xl font-bold text-heading">
              Não foi possível pedir ajuda
            </h2>
            <p className="mt-2 text-muted">{errorMsg}</p>
            <div className="mt-8 w-full space-y-3">
              <DangerButton onClick={handleConfirm}>
                Tentar novamente
              </DangerButton>
              <Button variant="ghost" fullWidth onClick={onClose}>
                Fechar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SentView({
  result,
  onClose,
  onFallback,
}: {
  result: SosResult;
  onClose: () => void;
  onFallback: (onlyIds?: Set<number>) => void;
}) {
  const total = result.results.length;
  const failed = result.results.filter((r) => !r.sent);
  const allSent = failed.length === 0;

  return (
    <>
      <IconCircle tone={allSent ? "sage" : "danger"}>
        {allSent ? (
          <Check size={40} className="text-sage-icon" aria-hidden="true" />
        ) : (
          <AlertTriangle size={38} className="text-danger" aria-hidden="true" />
        )}
      </IconCircle>
      <h2 className="mt-5 text-2xl font-bold text-heading">
        {allSent ? "Ajuda a caminho!" : "Avisamos parte dos contatos"}
      </h2>
      <p className="mt-2 text-muted">
        Mensagem enviada para <strong>{result.sentCount}</strong> de {total}{" "}
        contato{total > 1 ? "s" : ""}.
      </p>

      {!allSent && (
        <>
          <p className="mt-3 text-sm text-danger">
            Não conseguimos avisar: {failed.map((f) => f.name).join(", ")}.
          </p>
          <Button
            fullWidth
            variant="outline"
            className="mt-4"
            leftIcon={<MessageCircle size={18} />}
            onClick={() => onFallback(new Set(failed.map((f) => f.contactId)))}
          >
            Avisar pelo WhatsApp
          </Button>
        </>
      )}

      <Button variant="ghost" fullWidth className="mt-6" onClick={onClose}>
        Fechar
      </Button>
    </>
  );
}

function WhatsappLink({
  contact,
  message,
}: {
  contact: EmergencyContact;
  message: string;
}) {
  return (
    <a
      href={whatsappUrl(contact.phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 rounded-xl bg-[#25D366] px-4 py-3 font-semibold text-white transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/40"
    >
      <span className="flex items-center gap-2">
        <MessageCircle size={20} aria-hidden="true" />
        {contact.name}
      </span>
      <span className="text-sm font-normal text-white/90">
        {formatPhoneDisplay(contact.phone)}
      </span>
    </a>
  );
}

function IconCircle({
  tone,
  children,
}: {
  tone: "danger" | "sage";
  children: ReactNode;
}) {
  const ring =
    tone === "danger"
      ? "bg-danger/10 ring-danger/20"
      : "bg-sage ring-sage/40";
  return (
    <div
      className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ring-8 ${ring}`}
    >
      {children}
    </div>
  );
}

function DangerButton({
  children,
  onClick,
  autoFocus,
}: {
  children: ReactNode;
  onClick: () => void;
  autoFocus?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      autoFocus={autoFocus}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-danger px-6 py-4 text-base font-semibold text-white shadow-card transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      {children}
    </button>
  );
}
