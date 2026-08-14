import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { BfCombobox, BfMultiSelect, type BfComboboxOption } from "./BfCombobox";

const options: BfComboboxOption[] = [
  { value: "monthly", label: "Monthly", description: "High touch" },
  { value: "quarterly", label: "Quarterly", description: "Recommended rhythm", keywords: ["default"] },
  { value: "annual", label: "Annual", description: "Low change" },
];

function SingleHarness() {
  const [value, setValue] = useState("");
  return <BfCombobox label="Review cadence" value={value} onValueChange={setValue} options={options} />;
}

function MultiHarness() {
  const [value, setValue] = useState<string[]>(["monthly"]);
  return <BfMultiSelect label="Cadences" value={value} onValueChange={setValue} options={options} />;
}

function LimitedHarness() {
  const [value, setValue] = useState<string[]>([]);
  return <BfMultiSelect label="Limited cadences" value={value} onValueChange={setValue} options={options} maxSelections={2} />;
}

describe("BfCombobox", () => {
  it("filters a searchable list and selects with the keyboard", async () => {
    const user = userEvent.setup();
    render(<SingleHarness />);

    await user.click(screen.getByRole("combobox", { name: "Review cadence" }));
    const search = screen.getByRole("searchbox", { name: "Search options" });
    await user.type(search, "default");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: /Quarterly/ })).toBeVisible();

    await user.keyboard("{Enter}");
    expect(screen.getByRole("combobox", { name: "Review cadence" })).toHaveTextContent("Quarterly");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("toggles multiple values, keeps the list open, and exposes bulk actions", async () => {
    const user = userEvent.setup();
    render(<MultiHarness />);

    const trigger = screen.getByRole("combobox", { name: "Cadences" });
    expect(trigger).toHaveTextContent("Monthly");
    await user.click(trigger);
    const listbox = screen.getByRole("listbox", { name: "Cadences" });
    await user.click(within(listbox).getByRole("option", { name: /Quarterly/ }));
    expect(screen.getByRole("listbox", { name: "Cadences" })).toBeVisible();
    expect(trigger).toHaveTextContent("Quarterly");

    await user.click(screen.getByRole("button", { name: "Select all" }));
    expect(trigger).toHaveTextContent("+1 more");
    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(trigger).toHaveTextContent("Select options");
  });

  it("respects the selection limit during bulk selection", async () => {
    const user = userEvent.setup();
    render(<LimitedHarness />);
    const trigger = screen.getByRole("combobox", { name: "Limited cadences" });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Select all" }));
    expect(trigger).toHaveTextContent("Monthly");
    expect(trigger).toHaveTextContent("Quarterly");
    expect(trigger).not.toHaveTextContent("Annual");
  });

  it("portals and flips the list above a trigger near the viewport edge", async () => {
    const user = userEvent.setup();
    render(<MultiHarness />);
    const trigger = screen.getByRole("combobox", { name: "Cadences" });
    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue({
      bottom: 790,
      height: 40,
      left: 70,
      right: 370,
      top: 750,
      width: 300,
      x: 70,
      y: 750,
      toJSON: () => ({}),
    });

    await user.click(trigger);
    const listbox = screen.getByRole("listbox", { name: "Cadences" });
    const popover = listbox.closest(".bds-combobox__popover");
    expect(popover).toHaveAttribute("data-placement", "top");
    expect(popover?.parentElement).toBe(document.body);
    expect(popover).toHaveStyle({ bottom: "24px", maxHeight: "736px" });
  });
});
