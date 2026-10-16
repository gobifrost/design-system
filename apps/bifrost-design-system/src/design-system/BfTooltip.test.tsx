import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { BfTooltip } from "./BfTooltip";

describe("BfTooltip", () => {
  it("floats on hover, remains available over the tooltip, and dismisses with Escape", async () => {
    const user = userEvent.setup();
    render(<BfTooltip label="Script check" content="The installer is unavailable.">Needs Review</BfTooltip>);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await user.hover(screen.getByRole("button", { name: "Script check" }));
    const tip = screen.getByRole("tooltip");
    expect(tip).toHaveTextContent("The installer is unavailable.");
    expect(tip.parentElement).toBe(document.body);
    await user.hover(tip);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens on keyboard focus and click without creating a disclosure", async () => {
    const user = userEvent.setup();
    render(<BfTooltip label="Script check" content="Inputs are checked at deployment.">Available</BfTooltip>);
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Script check" });
    expect(trigger).toHaveAccessibleDescription("Inputs are checked at deployment.");
    await user.click(trigger);
    expect(screen.getByRole("tooltip")).toBeVisible();
    expect(document.querySelector("details")).toBeNull();
    await user.tab();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
  it("shows one explanation when hovering another trigger while the first stays focused", async () => {
    const user = userEvent.setup();
    render(<><BfTooltip label="First status" content="First explanation">Available</BfTooltip><BfTooltip label="Second status" content="Second explanation">Needs Review</BfTooltip></>);
    await user.tab();
    expect(screen.getByRole("tooltip")).toHaveTextContent("First explanation");
    await user.hover(screen.getByRole("button", {name:"Second status"}));
    expect(screen.getAllByRole("tooltip")).toHaveLength(1);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Second explanation");
  });

});
