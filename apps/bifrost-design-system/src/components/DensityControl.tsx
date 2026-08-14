import type { KeyboardEvent } from "react";
import type { Density } from "../design-system/types";

const densities: Array<{ value: Density; label: string; detail: string }> = [
  { value: "compact", label: "Compact", detail: "Repeated expert work" },
  { value: "comfortable", label: "Comfortable", detail: "Everyday internal apps" },
  { value: "spacious", label: "Spacious", detail: "Client-facing moments" },
];

interface DensityControlProps {
  value: Density;
  onChange: (value: Density) => void;
  detailed?: boolean;
}

export function DensityControl({ value, onChange, detailed = false }: DensityControlProps) {
  return (
    <div className={`density-control ${detailed ? "is-detailed" : ""}`} role="radiogroup" aria-label="Interface density">
      {densities.map((density, index) => (
        <button
          key={density.value}
          className={value === density.value ? "active" : ""}
          role="radio"
          aria-checked={value === density.value}
          tabIndex={value === density.value ? 0 : -1}
          onClick={() => onChange(density.value)}
          onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
            const previous = event.key === "ArrowLeft" || event.key === "ArrowUp";
            const next = event.key === "ArrowRight" || event.key === "ArrowDown";
            const target = event.key === "Home" ? 0 : event.key === "End" ? densities.length - 1 : previous ? (index - 1 + densities.length) % densities.length : next ? (index + 1) % densities.length : null;
            if (target === null) return;
            event.preventDefault();
            onChange(densities[target].value);
            event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=radio]")[target]?.focus();
          }}
        >
          <span>{density.label}</span>
          {detailed && <small>{density.detail}</small>}
        </button>
      ))}
    </div>
  );
}
