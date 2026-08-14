import { AlertTriangle, ArrowLeft, ArrowRight, Check, Download, Inbox, LoaderCircle, MoreHorizontal, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import type { KeyboardEvent } from "react";
import { useOutletContext } from "react-router-dom";
import type { CatalogContext } from "../components/AppShell";
import { DensityControl } from "../components/DensityControl";
import { PageIntro } from "../components/PageIntro";
import { BfAlert } from "../design-system/BfAlert";
import { BfButton } from "../design-system/BfButton";
import { BfChip } from "../design-system/BfChip";
import { BfDialog } from "../design-system/BfDialog";
import { BfSelect, BfTextarea, BfTextField } from "../design-system/BfField";
import { BfCheckbox, BfRadioGroup, BfSwitch } from "../design-system/BfSelection";
import { BfTabs } from "../design-system/BfTabs";

const componentNav = ["Actions", "Forms", "Selection", "Status", "Navigation", "Feedback", "Data", "Overlay", "Motion"] as const;
type ComponentName = typeof componentNav[number];

const catalog: Record<ComponentName, { note: string; properties: Array<[string, string]>; do: string; dont: string }> = {
  Actions: { note: "Actions are direct, sentence case, and stable. Hierarchy comes from fill and boundary; motion only confirms the press or state change.", properties: [["Height", "density token"], ["Radius", "6px"], ["Focus", "2px cyan"]], do: "Use one primary action per local decision.", dont: "Do not give every available action primary emphasis." },
  Forms: { note: "Labels remain visible above values. Help, required, disabled, and error states share one predictable field anatomy.", properties: [["Label", "persistent"], ["Message", "linked by id"], ["Error", "text + color"]], do: "Explain how the user can recover from invalid input.", dont: "Do not use placeholder text as the only label." },
  Selection: { note: "Checkboxes choose many, radios choose one, and switches apply an immediate binary setting. Their semantics are not interchangeable.", properties: [["Target", "40px minimum"], ["State", "native input"], ["Label", "clickable"]], do: "Match the control to the decision model.", dont: "Do not use a switch for a form value saved later." },
  Status: { note: "Status labels describe state with text and a square signal. They have no capsule or background and never imply interaction.", properties: [["Signal", "6px square"], ["Surface", "none"], ["Behavior", "read-only"]], do: "Pair every status color with a clear label.", dont: "Do not use status color as decoration." },
  Navigation: { note: "Local navigation preserves context. Tabs switch peer views; breadcrumbs show ancestry; pagination changes a bounded result set.", properties: [["Tabs", "equal peers"], ["Trail", "ancestry"], ["Pages", "bounded set"]], do: "Keep the current location visible in every navigation form.", dont: "Do not use tabs as a substitute for a multi-step workflow." },
  Feedback: { note: "Feedback is proportional to consequence. Inline messages stay near the work; banners summarize; empty states provide one useful next step.", properties: [["Info", "polite status"], ["Error", "alert"], ["Empty", "next action"]], do: "Name both what happened and what the user can do.", dont: "Do not show success feedback before the action completes." },
  Data: { note: "Tables support comparison through stable columns, aligned values, clear row actions, and pagination that never hides the current range.", properties: [["Row", "density token"], ["Numbers", "tabular"], ["Actions", "last column"]], do: "Keep column meaning visible while values scan vertically.", dont: "Do not center values that need comparison." },
  Overlay: { note: "Menus expose nearby actions. Dialogs interrupt only for focused decisions that must complete or be dismissed before returning.", properties: [["Menu", "local actions"], ["Dialog", "modal focus"], ["Dismiss", "Esc + close"]], do: "Return focus and context after dismissal.", dont: "Do not put ordinary page content in a modal." },
  Motion: { note: "Quiet machinery explains what changed. Pages settle, disclosure preserves spatial continuity, controls acknowledge input, and loading alone may loop.", properties: [["Feedback", "120ms"], ["Disclosure", "220ms"], ["Route", "360ms max"]], do: "Use motion to preserve continuity or confirm a state change.", dont: "Do not animate static decoration or make routine work wait." },
};

export function ComponentsPage() {
  const { density, setDensity } = useOutletContext<CatalogContext>();
  const [active, setActive] = useState<ComponentName>("Actions");
  const detail = catalog[active];

  return (
    <div className="page">
      <PageIntro title="See the behavior, not just the shape." description="Inspect the core controls needed to assemble Bifrost applications. Density, hierarchy, focus, validation, loading, and disabled states belong to the component contract." />
      <div className="workbench-toolbar">
        <div className="component-tabs" role="tablist" aria-label="Component families">
          {componentNav.map((item, index) => <button
            role="tab"
            aria-selected={active === item}
            tabIndex={active === item ? 0 : -1}
            className={active === item ? "active" : ""}
            key={item}
            onClick={() => setActive(item)}
            onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
              const previous = event.key === "ArrowLeft";
              const next = event.key === "ArrowRight";
              const target = event.key === "Home" ? 0 : event.key === "End" ? componentNav.length - 1 : previous ? (index - 1 + componentNav.length) % componentNav.length : next ? (index + 1) % componentNav.length : null;
              if (target === null) return;
              event.preventDefault();
              setActive(componentNav[target]);
              event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=tab]")[target]?.focus();
            }}
          >{item}</button>)}
        </div>
        <DensityControl value={density} onChange={setDensity} />
      </div>

      <section className="workbench">
        <div className="workbench-stage">
          <span className="specimen-label">Live specimen · {density}</span>
          <div className="workbench-content" key={active} role="tabpanel" aria-label={`${active} specimen`}>
            {active === "Actions" && <ActionSpecimen />}
            {active === "Forms" && <FormSpecimen />}
            {active === "Selection" && <SelectionSpecimen />}
            {active === "Status" && <StatusSpecimen />}
            {active === "Navigation" && <NavigationSpecimen />}
            {active === "Feedback" && <FeedbackSpecimen />}
            {active === "Data" && <DataSpecimen />}
            {active === "Overlay" && <OverlaySpecimen />}
            {active === "Motion" && <MotionSpecimen />}
          </div>
        </div>
        <aside className="workbench-notes">
          <span className="specimen-label">Usage notes</span>
          <h2>{active}</h2>
          <p>{detail.note}</p>
          <div className="property-list">{detail.properties.map(([label, value]) => <span key={label}>{label}<code>{value}</code></span>)}</div>
          <div className="do-dont"><div><Check size={15} /><p>{detail.do}</p></div><div><AlertTriangle size={15} /><p>{detail.dont}</p></div></div>
        </aside>
      </section>
    </div>
  );
}

function ActionSpecimen() {
  return <div className="specimen-stack"><div className="specimen-row"><BfButton icon={<Plus size={15} />}>Create proposal</BfButton><BfButton variant="secondary" icon={<Download size={15} />}>Export</BfButton><BfButton variant="ghost">Cancel</BfButton></div><div className="specimen-row"><BfButton disabled>Unavailable</BfButton><BfButton variant="secondary" icon={<span className="spin"><LoaderCircle size={15} /></span>} disabled aria-busy="true">Saving</BfButton><BfButton variant="danger" icon={<Trash2 size={15} />}>Remove</BfButton></div></div>;
}

function FormSpecimen() {
  return (
    <form className="form-specimen" onSubmit={(event) => event.preventDefault()}>
      <BfTextField label="Client name" defaultValue="Northwind Logistics" />
      <BfTextField label="Primary contact" leadingIcon={<Search size={15} />} placeholder="Search people" hint="Choose someone who can approve the plan." />
      <BfSelect label="Review cadence" defaultValue="quarterly" options={[{ value: "monthly", label: "Monthly" }, { value: "quarterly", label: "Quarterly" }, { value: "annual", label: "Annual" }]} />
      <BfTextField label="Review date" defaultValue="Not a date" error="Use a date like Aug 21, 2026." />
      <BfTextarea className="form-specimen__wide" label="Internal note" rows={3} defaultValue="Confirm the security roadmap before the client review." hint="Visible to Bifrost team members only." />
    </form>
  );
}

function SelectionSpecimen() {
  const [included, setIncluded] = useState(true);
  const [cadence, setCadence] = useState("quarterly");
  const [reminders, setReminders] = useState(false);
  return (
    <div className="selection-specimen">
      <div><span className="control-group-label">Include in plan</span><BfCheckbox checked={included} onChange={setIncluded}>Identity and access review</BfCheckbox><BfCheckbox checked={true} onChange={() => undefined} disabled>Baseline monitoring (required)</BfCheckbox></div>
      <BfRadioGroup label="Review cadence" value={cadence} onChange={setCadence} options={[{ value: "monthly", label: "Monthly" }, { value: "quarterly", label: "Quarterly" }, { value: "annual", label: "Annual" }]} />
      <BfSwitch checked={reminders} onChange={setReminders} label="Review reminders" description="Notify the account owner seven days before review." />
    </div>
  );
}

function StatusSpecimen() {
  return (
    <div className="status-specimen status-ledger">
      <div className="status-ledger-row status-ledger-head"><span>Client</span><span>State</span><span>Updated</span></div>
      <div className="status-ledger-row"><strong>Northwind Logistics</strong><BfChip tone="success">Healthy</BfChip><span>Today</span></div>
      <div className="status-ledger-row"><strong>Gray &amp; Finch</strong><BfChip tone="warning">Needs review</BfChip><span>Yesterday</span></div>
      <div className="status-ledger-row"><strong>Morrow Health</strong><BfChip tone="info">In progress</BfChip><span>Aug 11</span></div>
      <div className="status-ledger-row"><strong>Arbor Studio</strong><BfChip tone="danger">At risk</BfChip><span>Aug 08</span></div>
    </div>
  );
}

function NavigationSpecimen() {
  const [tab, setTab] = useState("overview");
  const [page, setPage] = useState(2);
  const labels: Record<string, string> = { overview: "Account health and current priorities.", activity: "Recent notes, reviews, and status changes.", files: "Plans, exports, and client-ready documents." };
  return (
    <div className="navigation-specimen">
      <nav className="bds-breadcrumbs" aria-label="Breadcrumb"><a href="#accounts">Accounts</a><span>/</span><a href="#northwind">Northwind Logistics</a><span>/</span><strong>Plan</strong></nav>
      <BfTabs distribution="equal" label="Account sections" value={tab} onChange={setTab} items={[{ id: "overview", label: "Overview" }, { id: "activity", label: "Activity" }, { id: "files", label: "Files" }]} />
      <div className="bds-tabpanel" role="tabpanel" id={`bds-tabpanel-${tab}`}><strong>{tab[0].toUpperCase() + tab.slice(1)}</strong><p>{labels[tab]}</p></div>
      <nav className="bds-pagination" aria-label="Pagination"><button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ArrowLeft size={16} /></button>{[1, 2, 3].map((item) => <button type="button" key={item} aria-current={page === item ? "page" : undefined} onClick={() => setPage(item)}>{item}</button>)}<button type="button" aria-label="Next page" disabled={page === 3} onClick={() => setPage((value) => Math.min(3, value + 1))}><ArrowRight size={16} /></button></nav>
    </div>
  );
}

function FeedbackSpecimen() {
  const [saved, setSaved] = useState(true);
  return (
    <div className="feedback-specimen">
      {saved ? <BfAlert tone="success" title="Plan saved" action={<button type="button" onClick={() => setSaved(false)}>Dismiss</button>}>The latest changes are available to the account team.</BfAlert> : <BfButton variant="secondary" onClick={() => setSaved(true)}>Show saved state</BfButton>}
      <BfAlert tone="warning" title="Two approvals remain">Assign an owner before sharing this plan with the client.</BfAlert>
      <div className="bds-empty"><Inbox size={26} /><div><strong>No client notes yet</strong><p>Capture the first decision or follow-up from this review.</p></div><BfButton variant="secondary" icon={<Plus size={15} />}>Add note</BfButton></div>
    </div>
  );
}

const dataRows = [
  ["Cloud readiness", "Discovery", "$18,400", "info"],
  ["Security uplift", "Approved", "$31,200", "success"],
  ["Device lifecycle", "Draft", "$12,750", "neutral"],
  ["Backup modernization", "Review", "$9,800", "warning"],
  ["Identity hardening", "At risk", "$21,600", "danger"],
] as const;

function DataSpecimen() {
  const [page, setPage] = useState(1);
  const pageRows = dataRows.slice((page - 1) * 3, page * 3);
  return (
    <div className="data-specimen">
      <div className="full-table"><div className="full-table-row full-table-head"><span>Opportunity</span><span>Stage</span><span>Value</span><span /></div>{pageRows.map(([name, stage, value, tone]) => <div className="full-table-row" key={name}><strong>{name}</strong><BfChip tone={tone}>{stage}</BfChip><span>{value}</span><button type="button" aria-label={`Open ${name}`}><ArrowRight size={15} /></button></div>)}</div>
      <div className="table-footer"><span>Showing {(page - 1) * 3 + 1}–{Math.min(page * 3, dataRows.length)} of {dataRows.length}</span><div><button type="button" aria-label="Previous results" disabled={page === 1} onClick={() => setPage(1)}><ArrowLeft size={15} /></button><button type="button" aria-label="Next results" disabled={page === 2} onClick={() => setPage(2)}><ArrowRight size={15} /></button></div></div>
    </div>
  );
}

function OverlaySpecimen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastAction, setLastAction] = useState("No action selected");
  const choose = (action: string) => { setLastAction(action); setMenuOpen(false); };
  return (
    <div className="overlay-specimen">
      <div className="overlay-actions"><div className="bds-menu"><BfButton variant="secondary" trailingIcon={<MoreHorizontal size={15} />} aria-haspopup="menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>Account actions</BfButton>{menuOpen && <div role="menu"><button role="menuitem" type="button" onClick={() => choose("Assigned owner")}>Assign owner</button><button role="menuitem" type="button" onClick={() => choose("Duplicated plan")}>Duplicate plan</button><button role="menuitem" type="button" onClick={() => choose("Archived plan")}>Archive plan</button></div>}</div><BfButton onClick={() => setDialogOpen(true)}>Review plan</BfButton></div>
      <p className="overlay-result" aria-live="polite">{lastAction}</p>
      <BfDialog open={dialogOpen} onOpenChange={setDialogOpen} title="Share this plan?" description="Northwind Logistics will receive the current approved version." footer={<><BfButton variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</BfButton><BfButton onClick={() => { setLastAction("Shared plan"); setDialogOpen(false); }}>Share plan</BfButton></>}><BfAlert tone="info" title="Client-visible content">Internal notes and draft recommendations will remain private.</BfAlert></BfDialog>
    </div>
  );
}

function MotionSpecimen() {
  const [replay, setReplay] = useState(0);
  return (
    <div className="motion-specimen">
      <div className="motion-specimen-header"><div><strong>Quiet machinery</strong><small>Motion explains state and relationship.</small></div><BfButton variant="secondary" icon={<RotateCcw size={15} />} onClick={() => setReplay((value) => value + 1)}>Replay</BfButton></div>
      <div className="motion-sequence" key={replay}><div className="motion-event motion-event--enter"><span>Enter</span><strong>Workspace ready</strong><small>Content settles into place.</small></div><div className="motion-event motion-event--update"><span>Update</span><strong>Plan approved</strong><BfChip tone="success">Complete</BfChip></div><div className="motion-event motion-event--load" aria-busy="true"><span>Load</span><strong>Refreshing account data</strong><div className="motion-loading-line"><i /></div></div></div>
    </div>
  );
}
