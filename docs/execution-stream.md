# BfExecutionStream

`BfExecutionStream` is the shared Bifrost execution surface for long-running work, live replay, and terminal outcomes. It belongs to the same dark/teal/spectrum identity as the rest of the design system and should feel like one family with the rest of Bifrost.

Use teal for primary actions, focus, and the current selection. Use the spectrum only for transport and live-work state, where it helps describe motion in the stream itself. Do not use the spectrum as decoration, and do not use it as a percentage or progress meter. Keep success, warning, and error semantic colors independent from connectivity so the user can tell transport state from execution state.

## Props

```ts
type BfExecutionStreamProps = {
  title: string;
  executionId: string;
  status: "queued" | "running" | "succeeded" | "failed" | "cancelled";
  connection: "connected" | "reconnecting" | "disconnected";
  events: {
    id: string;
    time: string;
    level: "info" | "success" | "warning" | "error";
    message: string;
  }[];
  onReconnect?: () => void;
};
```

`title` names the run the user is reading. `executionId` is the stable identifier for the execution being replayed. `status` describes the execution outcome and should be read as the task state, not the transport state. `connection` describes whether the stream is currently receiving updates. `events` is the bounded event list to render in order. `onReconnect` is the explicit user action for restoring the stream when transport is unavailable.

## Behavior

The stream should stay pinned to the latest event while the reader is at the bottom. If the reader scrolls away, stop forcing the view back down and show an explicit jump-to-latest control.

Do not flood live announcements when updates arrive. Announce state changes in a controlled way, and keep the feed readable even when events arrive quickly.

Respect reduced motion by keeping the seam between the header and the live feed static. Do not add scroll choreography, animated log insertion, or decorative motion that competes with the actual execution state.

The component is not virtualized. Keep retention bounded to a few hundred events and provide a separate full-log or paginated history view. Appending is position-preserving; removing entries that someone is reading is not. Buffer or snapshot the visible history during inspection instead of pruning it underneath the reader.

The component does not own the network connection. An adapter above it handles auth refresh, reconnect attempts, deduplication, ordering, and bounded retention before passing data into `events` and `connection`.

## Route Preview

`ExecutionPage` at `/execution` is a synthetic replay surface. It is meant to demonstrate the stream with fixed examples, including failure and reconnect cases, and it should not pretend to be a real API-backed execution viewer.

Use it to show:

- queued to running progress
- reconnecting transport
- successful completion
- failure with a visible error event

## React Integration

Pass an ordered snapshot from your existing subscription. Keep synthetic replay data in the catalog; production callers supply confirmed backend state.

```tsx
import {
  BfExecutionStream,
  type BfExecutionStreamProps,
} from "./components/bifrost/BfExecutionStream";

type ExecutionViewProps = {
  snapshot: Omit<BfExecutionStreamProps, "onReconnect">;
  reconnect: () => void;
};

// Your existing subscription supplies the snapshot. The callback requests a
// reconnect; only the transport's confirmed result updates connection state.
export function ExecutionView({ snapshot, reconnect }: ExecutionViewProps) {
  return <BfExecutionStream {...snapshot} onReconnect={reconnect} />;
}
```

In the replay page, keep the examples synthetic and deterministic. A failure case and a reconnect case should both be visible without requiring a live backend or a pretend streaming API.

## Testing

Pair the component with focused tests for scroll-follow behavior, explicit jump-to-latest control, reconnect handling, and event ordering. Keep the coverage aligned with [docs/component-test-matrix.md](component-test-matrix.md) and the local verification flow in [README.md](../README.md).
