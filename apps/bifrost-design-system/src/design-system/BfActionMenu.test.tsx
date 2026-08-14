import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BfActionMenu } from "./BfActionMenu";

describe("BfActionMenu", () => {
  it("opens a keyboard menu, selects an action, and returns focus", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<BfActionMenu label="Actions for Cloud readiness" items={[{ value: "open", label: "Open opportunity" }, { value: "archive", label: "Archive", tone: "danger" }]} onSelect={onSelect} />);

    const trigger = screen.getByRole("button", { name: "Actions for Cloud readiness" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menu", { name: "Actions for Cloud readiness" })).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "Open opportunity" })).toHaveFocus();

    await user.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledWith("archive");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
