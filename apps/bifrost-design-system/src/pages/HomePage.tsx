import { ArrowRight, Check, Clipboard, Copy, Search } from "lucide-react";
import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import type { CatalogContext } from "../components/AppShell";
import { DensityControl } from "../components/DensityControl";
import { SectionMarker } from "../components/SectionMarker";
import { BfAlert } from "../design-system/BfAlert";
import { BfButton } from "../design-system/BfButton";
import { BfChip } from "../design-system/BfChip";
import { BfTextField } from "../design-system/BfField";
import { BfTabs } from "../design-system/BfTabs";

const installCommand = "node scripts/add.mjs button --root ../your-app";
const navigationTabs = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Activity" },
  { id: "settings", label: "Settings" },
];

const accounts = [
  { name: "Northwind Logistics", owner: "AM", status: "Healthy", value: "$14,280" },
  { name: "Gray & Finch", owner: "JL", status: "Review", value: "$8,420" },
  { name: "Morrow Health", owner: "RK", status: "Healthy", value: "$22,610" },
];

export function HomePage() {
  const { density, setDensity } = useOutletContext<CatalogContext>();
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  async function copyInstallCommand() {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="page page--home">
      <div className="home-grid">
        <div className="home-primary">
          <header className="home-hero">
            <h1>Build interfaces that feel native to Bifrost.</h1>
            <div className="hero-copy">
              <p>Tokens, components, patterns, and motion for apps that stay clear under real operational pressure.</p>
              <div className="home-actions">
                <Link className="bds-button bds-button--primary" to="/components">Open workbench <ArrowRight size={16} /></Link>
                <button className="bds-button bds-button--secondary" type="button" onClick={copyInstallCommand}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copied" : "Copy install command"}
                </button>
              </div>
            </div>
          </header>

          <Link className="execution-reference" to="/execution"><span><strong>Built for work in motion.</strong><span>Explore the streaming execution pattern</span></span><ArrowRight size={20} aria-hidden="true" /></Link>

          <section className="live-specimens" aria-labelledby="live-specimens-title">
            <div className="specimens-heading">
              <div>
                <h2 id="live-specimens-title">Live component specimens</h2>
                <p>Try the system at working scale. Every state shown here is code-native.</p>
              </div>
              <DensityControl value={density} onChange={setDensity} />
            </div>

            <div className="specimen-list">
              <article className="specimen-row">
                <div><strong>Action</strong><small>Trigger operations and workflows.</small></div>
                <div className="specimen-demo"><BfButton>Primary action</BfButton><BfButton variant="secondary">Secondary</BfButton></div>
              </article>
              <article className="specimen-row">
                <div><strong>Status</strong><small>Communicate system and task state.</small></div>
                <div className="specimen-demo"><BfChip tone="success">Success</BfChip><BfChip tone="warning">At risk</BfChip><BfChip tone="danger">Failed</BfChip></div>
              </article>
              <article className="specimen-row">
                <div><strong>Input</strong><small>Collect and validate information.</small></div>
                <div className="specimen-demo specimen-demo--field"><BfTextField label="Search assets" leadingIcon={<Search size={15} />} placeholder="Search assets…" /></div>
              </article>
              <article className="specimen-row">
                <div><strong>Navigation</strong><small>Keep current location visible.</small></div>
                <div className="specimen-demo"><BfTabs label="Example navigation" items={navigationTabs} value={activeTab} onChange={setActiveTab} /></div>
              </article>
              <article className="specimen-row">
                <div><strong>Feedback</strong><small>Confirm outcomes and recovery.</small></div>
                <div className="specimen-demo specimen-demo--alert"><BfAlert tone="success" title="Configuration saved">The updated values are active.</BfAlert></div>
              </article>
            </div>
            <Link className="text-link" to="/components">See all components <ArrowRight size={16} /></Link>
          </section>
        </div>

        <aside className="home-aside" aria-label="Start building">
          <section>
            <h2>Start building</h2>
            <p>Install source into your app, then own and adapt it.</p>
            <div className="quick-install"><code>{installCommand}</code><button type="button" onClick={copyInstallCommand} aria-label="Copy install command"><Clipboard size={16} /></button></div>
            <Link className="text-link" to="/start">View installation guide <ArrowRight size={15} /></Link>
          </section>
          <section>
            <h2>Use the field guide</h2>
            <nav aria-label="Field guide shortcuts">
              <Link to="/foundations">Foundations <ArrowRight size={14} /></Link>
              <Link to="/components">Component workbench <ArrowRight size={14} /></Link>
              <Link to="/patterns">Application patterns <ArrowRight size={14} /></Link>
            </nav>
          </section>
          <section className="contract-note">
            <strong>Source-owned by default</strong>
            <p>Registry files are copied into the consuming repository. No runtime dependency, hidden theme, or version lock.</p>
          </section>
        </aside>
      </div>

      <div className="bridge-rule" aria-hidden="true" />

      <section className="working-rhythms" aria-labelledby="rhythms-title">
        <div className="rhythm-panel rhythm-panel--internal">
          <div className="specimen-heading">
            <div>
              <span className="specimen-label">Internal application</span>
              <h2 id="rhythms-title">More signal. Less ceremony.</h2>
            </div>
            <div className="search-control"><Search size={15} /><span>Find account</span><kbd>⌘ K</kbd></div>
          </div>
          <div className="mini-table">
            <div className="mini-table-row mini-table-head"><span>Account</span><span>Owner</span><span>Status</span><span>MRR</span></div>
            {accounts.map((account) => (
              <div className="mini-table-row" key={account.name}>
                <strong>{account.name}</strong><span>{account.owner}</span><span><i />{account.status}</span><span>{account.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rhythm-panel rhythm-panel--client">
          <span className="specimen-label">Client-facing application</span>
          <div className="client-message">
            <BfChip tone="success">Complete</BfChip>
            <h2>Your technology plan is ready.</h2>
            <p>Review the priorities we built together, then choose a time to walk through the next steps.</p>
            <BfButton className="client-action" trailingIcon={<ArrowRight size={17} />}>Review your plan</BfButton>
          </div>
        </div>
      </section>

      <section className="density-band">
        <div><span className="specimen-label">One system, three working rhythms</span><h2>Choose density from the work.</h2></div>
        <DensityControl value={density} onChange={setDensity} detailed />
      </section>

      <section className="home-principles">
        <SectionMarker title="The system at a glance" />
        <div className="principle-grid">
          <article><span>Structure</span><h3>Density without clutter</h3><p>Rules, alignment, and stable placement carry operational complexity before containers do.</p></article>
          <article><span>Action</span><h3>Cyan means decide</h3><p>Primary cyan identifies focus, current location, and forward action. It stays rare enough to remain useful.</p></article>
          <article><span>Motion</span><h3>The bridge explains change</h3><p>Spectrum motion connects routes, progress, transfer, and system relationships—never decoration.</p></article>
        </div>
      </section>
    </div>
  );
}
