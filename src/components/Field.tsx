import clsx from "clsx";
import { Input } from "./ui/input";

export function Field({
  label,
  type = "text",
  value,
  onChange,
  readOnly = false,
  autoComplete,
  name,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  autoComplete?: string;
  name?: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-5 top-1 text-xs text-[#6FA0FF]">
        {label}
      </span>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        readOnly={readOnly}
        autoComplete={autoComplete || "off"}
        name={name}
        className={clsx(
          "h-12 w-full rounded-full border px-5 pt-4 text-sm transition",
          value.trim() === "" && "bg-[#EAF1FF] border-transparent"
        )}
      />
    </div>
  );
}
