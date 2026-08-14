import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BfAlert } from "./BfAlert";

describe("BfAlert", () => {
  it("uses an assertive role for destructive feedback and keeps recovery copy", () => {
    render(<BfAlert tone="danger" title="Save failed">Check your connection and try again.</BfAlert>);
    expect(screen.getByRole("alert")).toHaveTextContent("Save failed");
    expect(screen.getByRole("alert")).toHaveTextContent("Check your connection and try again.");
  });
});
