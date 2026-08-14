import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BfDialog } from "./BfDialog";

describe("BfDialog", () => {
  it("opens as a native dialog and requests dismissal from its close control", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<BfDialog open onOpenChange={onOpenChange} title="Share this plan?">Review the client-visible content.</BfDialog>);

    expect(screen.getByRole("dialog")).toHaveAttribute("open");
    await user.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
