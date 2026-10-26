import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { TextField } from "./TextField";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

/** Password input with a button to show/hide what was typed. */
export function PasswordField({ className, ...rest }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <TextField
        type={visible ? "text" : "password"}
        className={`pr-12 ${className ?? ""}`}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Esconder senha" : "Mostrar senha"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-1 my-auto inline-flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-sage/60 hover:text-sage-icon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
      >
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
