import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BfCheckbox, BfSwitch } from "./BfSelection";

describe("Bifrost selection controls", () => {
  it("reports checkbox and switch changes through their semantic controls", async () => {
    const user = userEvent.setup();
    const onCheck = vi.fn();
    const onSwitch = vi.fn();
    render(<><BfCheckbox checked={false} onChange={onCheck}>Include report</BfCheckbox><BfSwitch checked={false} onChange={onSwitch} label="Review reminders" /></>);

    await user.click(screen.getByRole("checkbox", { name: "Include report" }));
    await user.click(screen.getByRole("switch", { name: "Review reminders" }));
    expect(onCheck).toHaveBeenCalledWith(true);
    expect(onSwitch).toHaveBeenCalledWith(true);
  });
});
