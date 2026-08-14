import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BifrostWordmark } from "./BifrostWordmark";

describe("BifrostWordmark", () => {
  it("renders a vector lockup for the requested surface", () => {
    const { rerender } = render(<BifrostWordmark surface="dark" />);
    const wordmark = screen.getByRole("img", { name: "Bifrost" });
    expect(wordmark).toHaveAttribute("data-surface", "dark");
    expect(wordmark.tagName).toBe("svg");
    expect(wordmark.querySelector("image")).not.toBeInTheDocument();

    rerender(<BifrostWordmark surface="light" />);
    expect(screen.getByRole("img", { name: "Bifrost" })).toHaveAttribute("data-surface", "light");
  });
});
