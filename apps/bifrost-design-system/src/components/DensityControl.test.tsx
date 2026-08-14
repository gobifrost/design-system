import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DensityControl } from "./DensityControl";

describe("DensityControl", () => {
  it("marks the current density and requests a new one", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DensityControl value="comfortable" onChange={onChange} />);

    expect(screen.getByRole("radio", { name: "Comfortable" })).toHaveAttribute("aria-checked", "true");
    await user.click(screen.getByRole("radio", { name: "Compact" }));
    expect(onChange).toHaveBeenCalledWith("compact");
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith("comfortable");
    expect(screen.getByRole("radio", { name: "Comfortable" })).toHaveFocus();
  });
});
