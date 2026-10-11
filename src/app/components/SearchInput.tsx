import { Search } from "lucide-react";
import { TextField } from "./TextField";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}

/** Search field with a leading magnifier, used in the list and register screens. */
export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  className,
  ...rest
}: SearchInputProps) {
  return (
    <TextField
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      leftIcon={<Search size={18} />}
      className={className}
      {...rest}
    />
  );
}
