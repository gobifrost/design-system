import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BfButton } from "./BfButton";

describe("BfButton", () => {
  it("fires its action and preserves disabled behavior", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<BfButton onClick={onClick}>Save changes</BfButton>);

    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(onClick).toHaveBeenCalledOnce();

    rerender(<BfButton disabled onClick={onClick}>Save changes</BfButton>);
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
