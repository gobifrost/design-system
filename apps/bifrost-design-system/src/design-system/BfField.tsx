import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useId } from "react";
import { ChevronDown } from "lucide-react";
import "./components.css";

type FieldChrome = {
  label: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
};

type TextFieldProps = FieldChrome & InputHTMLAttributes<HTMLInputElement>;

export function BfFieldLabel({ label, required = false, ...props }: { label: string; required?: boolean } & LabelHTMLAttributes<HTMLLabelElement>) {
  return <div className="bds-field__heading"><label className="bds-field__label" {...props}>{label}</label>{required && <span className="bds-field__required" aria-hidden="true">Required</span>}</div>;
}

export function BfTextField({ label, hint, error, leadingIcon, className = "", id: providedId, ...props }: TextFieldProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const messageId = `${id}-message`;

  return (
    <div className={`bds-field ${error ? "bds-field--error" : ""} ${className}`.trim()}>
      <BfFieldLabel htmlFor={id} label={label} required={props.required} />
      <span className={`bds-field__control ${leadingIcon ? "bds-field__control--icon" : ""}`}>
        {leadingIcon && <span className="bds-field__icon" aria-hidden="true">{leadingIcon}</span>}
        <input id={id} aria-invalid={Boolean(error)} aria-describedby={hint || error ? messageId : undefined} {...props} />
      </span>
      {(error || hint) && <small id={messageId}>{error ?? hint}</small>}
    </div>
  );
}

type SelectFieldProps = FieldChrome & SelectHTMLAttributes<HTMLSelectElement> & {
  options: Array<{ label: string; value: string }>;
};

export function BfSelect({ label, hint, error, options, className = "", id: providedId, ...props }: SelectFieldProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const messageId = `${id}-message`;

  return (
    <div className={`bds-field ${error ? "bds-field--error" : ""} ${className}`.trim()}>
      <BfFieldLabel htmlFor={id} label={label} required={props.required} />
      <span className="bds-field__control bds-field__control--select">
        <select id={id} aria-invalid={Boolean(error)} aria-describedby={hint || error ? messageId : undefined} {...props}>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <ChevronDown className="bds-field__select-icon" size={16} aria-hidden="true" />
      </span>
      {(error || hint) && <small id={messageId}>{error ?? hint}</small>}
    </div>
  );
}

type TextareaFieldProps = FieldChrome & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function BfTextarea({ label, hint, error, className = "", id: providedId, ...props }: TextareaFieldProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const messageId = `${id}-message`;

  return (
    <div className={`bds-field ${error ? "bds-field--error" : ""} ${className}`.trim()}>
      <BfFieldLabel htmlFor={id} label={label} required={props.required} />
      <textarea id={id} aria-invalid={Boolean(error)} aria-describedby={hint || error ? messageId : undefined} {...props} />
      {(error || hint) && <small id={messageId}>{error ?? hint}</small>}
    </div>
  );
}
