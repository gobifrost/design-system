import { useEffect, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { BfButton } from "../design-system/BfButton";
import { BfExecutionStream, type ExecutionEvent, type ExecutionStatus, type StreamConnection } from "../design-system/BfExecutionStream";
import { CopyCode } from "../design-system/CopyCode";

const output: ExecutionEvent[] = [
  { id: "1", time: "14:32:01", level: "info", message: "Starting workflows/device_inventory.py" },
  { id: "2", time: "14:32:01", level: "info", message: "Loading organization context: Northwind Logistics" },
  { id: "3", time: "14:32:02", level: "success", message: "Integration connected. Fetching device inventory." },
  ...Array.from({ length: 12 }, (_, index): ExecutionEvent => ({ id: String(index + 4), time: `14:32:${String(index + 3).padStart(2, "0")}`, level: "info", message: `Received page ${index + 1} · ${(index + 1) * 100} device records` })),
  { id: "16", time: "14:32:15", level: "warning", message: "3 devices have no assigned owner. Included for review." },
  { id: "17", time: "14:32:16", level: "success", message: "Inventory saved. 1,200 devices processed." },
];
const failure: ExecutionEvent = { id: "failure", time: "14:32:07", level: "error", message: "Inventory request failed: the integration denied access. Check its permissions before retrying." };
type Scenario = "success" | "failure" | "disconnect";

export function ExecutionPage() {
  const [scenario, setScenario] = useState<Scenario>("success");
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<ExecutionStatus>("queued");
  const [connection, setConnection] = useState<StreamConnection>("connected");
  const [run, setRun] = useState(1);
  const [interrupted, setInterrupted] = useState(false);
  useEffect(() => {
    if (status !== "running" || connection !== "connected") return;
    const timer = window.setTimeout(() => {
      if (scenario === "failure" && count >= 7) setStatus("failed");
      else if (scenario === "disconnect" && count >= 7 && !interrupted) { setConnection("disconnected"); setInterrupted(true); }
      else if (count >= output.length) setStatus("succeeded");
      else setCount((value) => value + 1);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [status, connection, scenario, count, interrupted]);
  useEffect(() => {
    if (connection !== "reconnecting") return;
    const timer = window.setTimeout(() => setConnection("connected"), 1200);
    return () => window.clearTimeout(timer);
  }, [connection]);
  function reset(next: Scenario) {
    setScenario(next); setCount(0); setStatus("queued"); setConnection("connected"); setInterrupted(false); setRun((value) => value + 1);
  }
  const events = output.slice(0, count);
  if (status === "failed") events.push(failure);
  return (
    <div className="page page--execution">
      <header className="execution-intro"><h1>See the work<br />as it happens.</h1><p>Code runs. Output arrives. The bridge makes the connection visible, while the interface keeps your place.</p></header>
      <div className="execution-example">
        <div className="execution-controls"><div><strong>Streaming execution</strong><span>Interactive example · simulated events</span></div><div className="execution-controls__actions"><label htmlFor="execution-scenario">Scenario</label><select id="execution-scenario" value={scenario} onChange={(event) => reset(event.target.value as Scenario)}><option value="success">Successful run</option><option value="failure">Execution failure</option><option value="disconnect">Connection lost</option></select>{status === "queued" ? <BfButton icon={<Play size={14} />} onClick={() => setStatus("running")}>Run example</BfButton> : <BfButton variant="secondary" icon={<RotateCcw size={14} />} onClick={() => reset(scenario)}>Reset</BfButton>}{status === "running" && <BfButton variant="ghost" onClick={() => { setStatus("cancelled"); setConnection("connected"); }}>Cancel example</BfButton>}</div></div>
        <BfExecutionStream title="Sync device inventory" executionId={`example-run-${String(run).padStart(3, "0")}`} status={status} connection={connection} events={events} onReconnect={() => setConnection("reconnecting")} />
      </div>
      <section className="execution-principles" aria-label="Execution design principles"><article><span className="execution-key execution-key--spectrum" aria-hidden="true" /><h2>Connection has a color.</h2><p>The spectrum belongs to active transfer. It stops when the connection drops or the run ends. It never invents a completion percentage.</p></article><article><span className="execution-key execution-key--teal" aria-hidden="true" /><h2>Action has a focus.</h2><p>Teal identifies what you can do and where you are. Output stays neutral; warnings and outcomes keep their own semantic colors.</p></article><article><span className="execution-key execution-key--neutral" aria-hidden="true" /><h2>Your place is protected.</h2><p>Scroll back to inspect earlier output. New events keep arriving without moving your view. Jump to latest when you are ready.</p></article></section>
      <section className="execution-adoption"><div><h2>One pattern. Your transport.</h2><p>Use the same source in a Bifrost app or the platform itself. Supply events and state from your existing execution subscription. The component owns presentation, not the connection.</p></div><CopyCode code="node scripts/add.mjs execution-stream --root ../your-app" language="shell" /></section>
    </div>
  );
}
