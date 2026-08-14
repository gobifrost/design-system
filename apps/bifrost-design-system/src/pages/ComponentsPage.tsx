import { AlertTriangle, ArrowLeft, ArrowRight, Check, Copy, Download, ExternalLink, Inbox, LoaderCircle, MoreHorizontal, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { useOutletContext } from "react-router-dom";
import type { CatalogContext } from "../components/AppShell";
import { DensityControl } from "../components/DensityControl";
import { PageIntro } from "../components/PageIntro";
import { BfAlert } from "../design-system/BfAlert";
import { BfActionMenu } from "../design-system/BfActionMenu";
import { BfButton } from "../design-system/BfButton";
import { BfChip } from "../design-system/BfChip";
import { BfCombobox, BfMultiSelect, type BfComboboxOption } from "../design-system/BfCombobox";
import { BfDataTable, type BfDataColumn } from "../design-system/BfDataTable";
import { BfDialog } from "../design-system/BfDialog";
import { BfTextarea, BfTextField } from "../design-system/BfField";
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
  Data: { note: "The production table owns scrolling, sticky headers, sorting, selection, row activation, loading, empty, error, and pinned pagination states. Toolbars compose search and filters without changing table semantics.", properties: [["Scroll", "owned + capped"], ["Header", "sticky + sortable"], ["Rows", "selectable + navigable"]], do: "Keep state and column meaning visible while values scan vertically.", dont: "Do not rebuild selection, loading, or pagination ad hoc in each screen." },
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
  const [cadence, setCadence] = useState("quarterly");
  const [owners, setOwners] = useState(["maya", "jon"]);
  return (
    <form className="form-specimen" onSubmit={(event) => event.preventDefault()}>
      <BfTextField label="Client name" defaultValue="Northwind Logistics" />
      <BfTextField label="Primary contact" leadingIcon={<Search size={15} />} placeholder="Search people" hint="Choose someone who can approve the plan." />
      <BfCombobox label="Review cadence" value={cadence} onValueChange={setCadence} searchPlaceholder="Search cadences" options={cadenceOptions} />
      <BfTextField label="Review date" defaultValue="Not a date" error="Use a date like Aug 21, 2026." />
      <BfMultiSelect className="form-specimen__wide" label="Account owners" value={owners} onValueChange={setOwners} searchPlaceholder="Search people" options={ownerOptions} hint="Search, select several, or remove a person from the trigger." />
      <BfTextarea className="form-specimen__wide" label="Internal note" rows={3} defaultValue="Confirm the security roadmap before the client review." hint="Visible to Bifrost team members only." />
    </form>
  );
}

const cadenceOptions: BfComboboxOption[] = [
  { value: "monthly", label: "Monthly", description: "A high-touch operating rhythm" },
  { value: "quarterly", label: "Quarterly", description: "Recommended for active accounts" },
  { value: "annual", label: "Annual", description: "For stable, low-change accounts" },
];

const ownerOptions: BfComboboxOption[] = [
  { value: "maya", label: "Maya Patel", description: "Account owner", keywords: ["strategy"] },
  { value: "jon", label: "Jon Bell", description: "Technical lead", keywords: ["engineering"] },
  { value: "ruth", label: "Ruth Kim", description: "Security lead", keywords: ["risk"] },
  { value: "diego", label: "Diego Alvarez", description: "Client success", keywords: ["relationship"] },
];

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

type Opportunity = {
  id: string;
  name: string;
  account: string;
  stage: "Discovery" | "Approved" | "Draft" | "Review" | "At risk";
  value: number;
  owner: string;
};

const dataRows: Opportunity[] = [
  { id: "opp-1", name: "Cloud readiness", account: "Northwind Logistics", stage: "Discovery", value: 18400, owner: "Maya Patel" },
  { id: "opp-2", name: "Security uplift", account: "Gray & Finch", stage: "Approved", value: 31200, owner: "Ruth Kim" },
  { id: "opp-3", name: "Device lifecycle", account: "Arbor Studio", stage: "Draft", value: 12750, owner: "Jon Bell" },
  { id: "opp-4", name: "Backup modernization", account: "Morrow Health", stage: "Review", value: 9800, owner: "Diego Alvarez" },
  { id: "opp-5", name: "Identity hardening", account: "Northwind Logistics", stage: "At risk", value: 21600, owner: "Ruth Kim" },
  { id: "opp-6", name: "Branch connectivity", account: "Gray & Finch", stage: "Approved", value: 14600, owner: "Maya Patel" },
  { id: "opp-7", name: "Compliance evidence", account: "Morrow Health", stage: "Discovery", value: 8900, owner: "Jon Bell" },
];

const stageTone = { Discovery: "info", Approved: "success", Draft: "neutral", Review: "warning", "At risk": "danger" } as const;
const stageOptions: BfComboboxOption[] = Object.keys(stageTone).map((stage) => ({ value: stage, label: stage }));
const createDataColumns = (onAction: (row: Opportunity, action: string) => void): BfDataColumn<Opportunity>[] => [
  { id: "name", header: "Opportunity", width: "38%", sortable: true, sortValue: (row) => row.name, cell: (row) => <span className="data-row-name"><strong>{row.name}</strong><small>{row.account}</small></span> },
  { id: "stage", header: "Stage", width: "19%", sortable: true, sortValue: (row) => row.stage, cell: (row) => <BfChip tone={stageTone[row.stage]}>{row.stage}</BfChip> },
  { id: "owner", header: "Owner", width: "18%", sortable: true, accessor: "owner" },
  { id: "value", header: "Value", width: "16%", align: "end", sortable: true, sortValue: (row) => row.value, cell: (row) => `$${row.value.toLocaleString()}` },
  { id: "action", header: <span className="sr-only">Actions</span>, width: "2.75rem", align: "end", cell: (row) => <BfActionMenu label={`Actions for ${row.name}`} items={[{ value: "open", label: "Open opportunity", icon: <ExternalLink size={14} /> }, { value: "duplicate", label: "Duplicate", icon: <Copy size={14} /> }, { value: "archive", label: "Archive", icon: <Trash2 size={14} />, tone: "danger", separatorBefore: true }]} onSelect={(action) => onAction(row, action)} /> },
];

function DataSpecimen() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [stages, setStages] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [lastOpened, setLastOpened] = useState<string>();
  const columns = useMemo(() => createDataColumns((row, action) => setLastOpened(`${action === "open" ? "Opened" : action === "duplicate" ? "Duplicated" : "Archived"} ${row.name}`)), []);
  const filtered = dataRows.filter((row) => {
    const matchesQuery = `${row.name} ${row.account} ${row.owner}`.toLocaleLowerCase().includes(query.toLocaleLowerCase());
    return matchesQuery && (!stages.length || stages.includes(row.stage));
  });
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  return (
    <div className="data-specimen">
      <BfDataTable
        ariaLabel="Sales opportunities"
        rows={pageRows}
        columns={columns}
        getRowId={(row) => row.id}
        defaultSort={{ columnId: "value", direction: "descending" }}
        selection="multiple"
        selectedRowIds={selected}
        onSelectionChange={setSelected}
        onRowActivate={(row) => setLastOpened(row.name)}
        emptyState={{ title: "No matching opportunities", description: "Change the search or stage filters to widen the result set.", action: <BfButton variant="secondary" onClick={() => { setQuery(""); setStages([]); }}>Clear filters</BfButton> }}
        toolbar={<>
          <BfTextField className="data-toolbar-search" label="Search opportunities" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} leadingIcon={<Search size={15} />} placeholder="Search opportunities" />
          <BfMultiSelect className="data-toolbar-filter" label="Filter by stage" value={stages} onValueChange={(next) => { setStages(next); setPage(1); }} options={stageOptions} placeholder="All stages" maxDisplayedItems={1} showBulkActions={false} />
        </>}
        footer={<span>{selected.length ? `${selected.length} selected across results` : lastOpened ? `Opened ${lastOpened}` : "Select rows for bulk actions"}</span>}
        pagination={{ page: safePage, pageSize, total: filtered.length, onPageChange: setPage }}
        maxHeight="25rem"
        minWidth="38rem"
      />
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
