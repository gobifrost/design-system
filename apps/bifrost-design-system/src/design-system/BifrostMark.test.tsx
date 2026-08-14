import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BifrostMark } from "./BifrostMark";

describe("BifrostMark", () => {
  it("uses the native brand asset with an accessible name", () => {
    render(<BifrostMark size={40} />);

    expect(screen.getByRole("img", { name: "Bifrost" })).toHaveAttribute("src", "/brand/logo-square.svg");
  });
});
