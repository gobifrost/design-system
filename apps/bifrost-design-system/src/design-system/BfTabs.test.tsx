import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BfTabs } from "./BfTabs";

describe("BfTabs", () => {
  it("exposes selection and requests the next peer view", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BfTabs label="Account sections" items={[{ id: "overview", label: "Overview" }, { id: "activity", label: "Activity" }]} value="overview" onChange={onChange} />);

    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("tab", { name: "Activity" }));
    expect(onChange).toHaveBeenCalledWith("activity");
    await user.keyboard("{ArrowLeft}");
    expect(onChange).toHaveBeenCalledWith("overview");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
  });
});
