import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BfExecutionStream, type ExecutionEvent } from "./BfExecutionStream";
const first: ExecutionEvent = { id: "1", time: "12:00:00", level: "info", message: "Starting inventory" };
const base = { title: "Inventory", executionId: "run-1", status: "running" as const, connection: "connected" as const };
describe("BfExecutionStream", () => {
  it("keeps transport loss separate from outcome and delegates reconnect", async () => {
    const reconnect = vi.fn();
    render(<BfExecutionStream {...base} connection="disconnected" events={[first]} onReconnect={reconnect} />);
    expect(screen.getByText("Running")).toBeVisible();
    expect(screen.getByText(/execution may still be running/)).toBeVisible();
    expect(screen.getByText("Starting inventory")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Reconnect" }));
    expect(reconnect).toHaveBeenCalledOnce();
  });
  it("preserves reader position on arrival and resumes on request", async () => {
    const { rerender } = render(<BfExecutionStream {...base} events={[first]} />);
    const viewport = screen.getByRole("region", { name: "Execution events" });
    Object.defineProperties(viewport, { scrollHeight: { configurable: true, value: 1000 }, clientHeight: { configurable: true, value: 340 } });
    viewport.scrollTop = 100;
    fireEvent.scroll(viewport);
    rerender(<BfExecutionStream {...base} events={[first, { ...first, id: "2", message: "Next page" }]} />);
    expect(viewport.scrollTop).toBe(100);
    await userEvent.click(screen.getByRole("button", { name: "Jump to latest" }));
    expect(viewport.scrollTop).toBe(1000);
    expect(screen.queryByRole("button", { name: "Jump to latest" })).not.toBeInTheDocument();
  });
  it("resets following for a new execution and renders messages as text", () => {
    const { rerender } = render(<BfExecutionStream {...base} events={[first]} />);
    const viewport = screen.getByRole("region", { name: "Execution events" });
    Object.defineProperties(viewport, { scrollHeight: { configurable: true, value: 1000 }, clientHeight: { configurable: true, value: 340 } });
    fireEvent.scroll(viewport);
    rerender(<BfExecutionStream {...base} executionId="run-2" status="failed" events={[{ ...first, message: "<script>alert('x')</script>" }]} />);
    expect(viewport.scrollTop).toBe(1000);
    expect(screen.getByText("Failed")).toBeVisible();
    expect(viewport.querySelector("script")).toBeNull();
    expect(viewport).toHaveTextContent("<script>alert('x')</script>");
  });
  it("explains empty states without announcing every log", () => {
    const { rerender } = render(<BfExecutionStream {...base} status="queued" events={[]} />);
    expect(screen.getByText("Waiting for execution to start.")).toBeVisible();
    rerender(<BfExecutionStream {...base} status="succeeded" events={[]} />);
    expect(screen.getByText("No output was recorded for this execution.")).toBeVisible();
    expect(screen.getByRole("region", { name: "Execution events" })).not.toHaveAttribute("aria-live");
  });
});
