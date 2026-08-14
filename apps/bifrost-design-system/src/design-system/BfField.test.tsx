import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BfTextField } from "./BfField";

describe("BfTextField", () => {
  it("links a persistent label and recovery message to invalid input", () => {
    render(<BfTextField label="Review date" error="Use a date like Aug 21, 2026." />);

    const input = screen.getByRole("textbox", { name: "Review date" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Use a date like Aug 21, 2026.");
  });
});
