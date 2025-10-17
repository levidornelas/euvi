import clsx from "clsx";
import { Input } from "./ui/input";
import { useEffect, useRef } from "react";

export function Field({
  label,
  type = "text",
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Force remove readonly on mount and interaction
  useEffect(() => {
    const input = inputRef.current;
    if (!input || readOnly) return;

    const removeReadonly = () => {
      input.removeAttribute("readonly");
      input.readOnly = false;
    };

    // Remove readonly immediately
    removeReadonly();

    // Add event listeners to ensure input stays editable
    const events = ["focus", "click", "touchstart"];
    events.forEach((event) => {
      input.addEventListener(event, removeReadonly);
    });

    return () => {
      events.forEach((event) => {
        input.removeEventListener(event, removeReadonly);
      });
    };
  }, [readOnly]);

  // Use text type for email to avoid autofill issues, but keep email keyboard
  const inputType = type === "email" ? "text" : type;
  const inputMode = type === "email" ? "email" : undefined;

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-5 top-1 text-xs text-[#6FA0FF]">
        {label}
      </span>
      <Input
        ref={inputRef}
        type={inputType}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => {
          // Force remove readonly on focus
          if (!readOnly) {
            e.target.removeAttribute("readonly");
            e.target.readOnly = false;
          }
        }}
        placeholder={label}
        readOnly={readOnly}
        autoComplete="off"
        name={`field-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className={clsx(
          "h-12 w-full rounded-full border px-5 pt-4 text-sm transition",
          value.trim() === "" && "bg-[#EAF1FF] border-transparent"
        )}
      />
    </div>
  );
}
