import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BfChip } from "./BfChip";

describe("BfChip", () => {
  it("pairs a semantic tone class with visible status text", () => {
    render(<BfChip tone="warning">Needs review</BfChip>);

    expect(screen.getByText("Needs review")).toHaveClass("bds-chip--warning");
  });
});
