import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BfCombobox } from "./BfCombobox";
import { BfSelect, BfTextField, BfTextarea } from "./BfField";

describe("Bf fields", () => {
  it("links a persistent label and recovery message to invalid input", () => {
    render(<BfTextField label="Review date" error="Use a date like Aug 21, 2026." />);

    const input = screen.getByRole("textbox", { name: "Review date" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Use a date like Aug 21, 2026.");
  });

  it("makes required fields explicit without changing their accessible names", () => {
    render(<>
      <BfTextField label="Deployment Name" required />
      <BfSelect label="Company" required options={[{ value: "", label: "Choose a company" }]} />
      <BfTextarea label="Notes" required />
      <BfCombobox label="Computer" required options={[]} value="" onValueChange={() => {}} />
    </>);

    const text = screen.getByRole("textbox", { name: "Deployment Name" });
    const select = screen.getByRole("combobox", { name: "Company" });
    const textarea = screen.getByRole("textbox", { name: "Notes" });
    const combobox = screen.getByRole("combobox", { name: "Computer" });

    expect(screen.getByLabelText("Deployment Name")).toBe(text);
    expect(screen.getByLabelText("Company")).toBe(select);
    expect(screen.getByLabelText("Notes")).toBe(textarea);
    expect(text).toBeRequired();
    expect(select).toBeRequired();
    expect(textarea).toBeRequired();
    expect(combobox).toHaveAttribute("aria-required", "true");
    expect(screen.getAllByText("Required", { selector: ".bds-field__required" })).toHaveLength(4);
    expect(select.parentElement).toHaveClass("bds-field__control--select");
    expect(select.parentElement?.querySelector(".bds-field__select-icon")).toBeInTheDocument();
  });
});
