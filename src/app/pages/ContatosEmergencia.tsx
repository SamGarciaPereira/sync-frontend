import { useEffect, useState, type FormEvent } from "react";
import {
  Phone,
  RotateCcw,
  Siren,
  Star,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { IconBadge } from "../components/IconBadge";
import { TextField } from "../components/TextField";
import { cn } from "../lib/cn";
import { formatPhoneDisplay } from "../lib/whatsapp";
import {
  emergencyService,
  type EmergencyContact,
} from "../../services/emergency";
import { getApiErrorMessage } from "../../services/errors";

type Status = "loading" | "ready" | "error";

const EMPTY_FORM = { name: "", phone: "", relationship: "", isPrimary: false };

export function ContatosEmergencia() {
  const [items, setItems] = useState<EmergencyContact[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;
    emergencyService
      .list()
      .then((data) => {
        if (ignore) return;
        setItems(data);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setLoadError(getApiErrorMessage(err));
        setStatus("error");
      });
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  const retry = () => {
    setStatus("loading");
    setLoadError(null);
    reload();
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError(null);
  };

  const startEdit = (contact: EmergencyContact) => {
    setEditingId(contact.id);
    setForm({
      name: contact.name,
      phone: formatPhoneDisplay(contact.phone),
      relationship: contact.relationship ?? "",
      isPrimary: contact.isPrimary,
    });
    setFormError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!form.name.trim() || !form.phone.trim()) {
      setFormError("Informe o nome e o telefone do contato.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      relationship: form.relationship.trim() || null,
      isPrimary: form.isPrimary,
    };

    setSaving(true);
    try {
      if (editingId) {
        await emergencyService.update(editingId, payload);
      } else {
        await emergencyService.create(payload);
      }
      resetForm();
      reload();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleMakePrimary = async (contact: EmergencyContact) => {
    setActionError(null);
    setBusyId(contact.id);
    try {
      await emergencyService.update(contact.id, { isPrimary: true });
      reload();
    } catch (err) {
      setActionError(getApiErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (contact: EmergencyContact) => {
    if (!window.confirm(`Remover ${contact.name} dos contatos de emergência?`))
      return;
    setActionError(null);
    setBusyId(contact.id);
    try {
      await emergencyService.remove(contact.id);
      if (editingId === contact.id) resetForm();
      reload();
    } catch (err) {
      setActionError(getApiErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">
          Contatos de emergência
        </h1>
        <p className="mt-1.5 text-muted">
          Quem será avisado pelo WhatsApp quando você usar o botão de SOS.
        </p>
      </header>

      <Card
        icon={editingId ? Phone : UserPlus}
        title={editingId ? "Editar contato" : "Adicionar contato"}
        subtitle={
          editingId
            ? "Atualize os dados e salve."
            : "O primeiro contato vira o principal automaticamente."
        }
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <TextField
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Nome (ex.: Maria, minha filha)"
            aria-label="Nome do contato"
            autoComplete="name"
          />
          <TextField
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="Telefone com DDD (ex.: (41) 99999-8888)"
            aria-label="Telefone do contato"
            inputMode="tel"
            type="tel"
            leftIcon={<Phone size={18} aria-hidden="true" />}
          />
          <TextField
            value={form.relationship}
            onChange={(e) =>
              setForm((f) => ({ ...f, relationship: e.target.value }))
            }
            placeholder="Parentesco (opcional, ex.: Filha)"
            aria-label="Parentesco"
          />
          <label className="flex items-center gap-2 text-sm text-heading">
            <input
              type="checkbox"
              checked={form.isPrimary}
              onChange={(e) =>
                setForm((f) => ({ ...f, isPrimary: e.target.checked }))
              }
              className="h-4 w-4 rounded border-surface-border text-forest focus:ring-forest/40"
            />
            Tornar este o contato principal
          </label>

          {formError && (
            <p
              role="alert"
              className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              {formError}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving
                ? "Salvando…"
                : editingId
                  ? "Salvar alterações"
                  : "Adicionar contato"}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="ghost"
                onClick={resetForm}
                leftIcon={<X size={18} />}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      {actionError && (
        <p
          role="alert"
          className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {actionError}
        </p>
      )}

      {status === "loading" && (
        <div className="rounded-card border border-surface-border bg-surface/60 p-10 text-center text-muted">
          Carregando contatos…
        </div>
      )}

      {status === "error" && (
        <div className="rounded-card border border-dashed border-danger/40 bg-surface/60 p-10 text-center">
          <p className="font-medium text-heading">
            Não foi possível carregar seus contatos
          </p>
          <p className="mt-1 text-sm text-muted">{loadError}</p>
          <Button
            variant="outline"
            className="mt-4"
            leftIcon={<RotateCcw size={16} />}
            onClick={retry}
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {status === "ready" &&
        (items.length === 0 ? (
          <div className="rounded-card border border-dashed border-surface-border bg-surface/60 p-10 text-center">
            <IconBadge icon={Siren} size="lg" />
            <p className="mt-4 font-medium text-heading">
              Nenhum contato cadastrado
            </p>
            <p className="mt-1 text-sm text-muted">
              Adicione quem deve ser avisado numa emergência.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                busy={busyId === contact.id}
                onEdit={() => startEdit(contact)}
                onDelete={() => handleDelete(contact)}
                onMakePrimary={() => handleMakePrimary(contact)}
              />
            ))}
          </ul>
        ))}
    </div>
  );
}

function ContactCard({
  contact,
  busy,
  onEdit,
  onDelete,
  onMakePrimary,
}: {
  contact: EmergencyContact;
  busy: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMakePrimary: () => void;
}) {
  return (
    <li
      className={cn(
        "rounded-card border border-surface-border bg-surface p-4 shadow-card transition-opacity",
        busy && "opacity-50",
      )}
    >
      <div className="flex items-start gap-3">
        <IconBadge icon={Phone} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-heading">
              {contact.name}
            </h3>
            {contact.isPrimary && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sage px-2.5 py-0.5 text-xs font-semibold text-sage-icon">
                <Star size={12} aria-hidden="true" /> Principal
              </span>
            )}
          </div>
          <p className="text-sm text-muted">
            {formatPhoneDisplay(contact.phone)}
            {contact.relationship ? ` · ${contact.relationship}` : ""}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {!contact.isPrimary && (
              <Button
                variant="outline"
                leftIcon={<Star size={16} />}
                onClick={onMakePrimary}
                disabled={busy}
              >
                Tornar principal
              </Button>
            )}
            <Button variant="ghost" onClick={onEdit} disabled={busy}>
              Editar
            </Button>
            <button
              type="button"
              aria-label={`Remover ${contact.name}`}
              onClick={onDelete}
              disabled={busy}
              className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-danger transition-colors hover:bg-danger/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
