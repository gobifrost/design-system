import { useBifrostContext } from "bifrost";
import { Bell, Calendar, ChevronDown, Laptop, Moon, MoreHorizontal, Search, ShieldCheck, Sun } from "lucide-react";
import { useState } from "react";
import { PageIntro } from "../components/PageIntro";
import { SectionMarker } from "../components/SectionMarker";
import { BifrostMark } from "../design-system/BifrostMark";
import { BfButton } from "../design-system/BfButton";
import { BfChip } from "../design-system/BfChip";

const priorities = [
  {
    id: "identity",
    number: "01",
    title: "Strengthen identity security",
    summary: "Complete by October",
    detail: "Roll out phishing-resistant sign-in for administrators first, then expand enrollment to the full team.",
    Icon: ShieldCheck,
  },
  {
    id: "devices",
    number: "02",
    title: "Plan device replacements",
    summary: "Budget for Q1",
    detail: "Replace the oldest twelve devices in one planned cycle and standardize the approved model for new hires.",
    Icon: Calendar,
  },
  {
    id: "standards",
    number: "03",
    title: "Standardize the workspace",
    summary: "Begin in November",
    detail: "Create one supported application baseline so every team member starts with the same secure, maintained workspace.",
    Icon: Laptop,
  },
] as const;

export function PatternsPage() {
  const { theme, toggleTheme } = useBifrostContext();
  const [openPriority, setOpenPriority] = useState<string>(priorities[0].id);

  return (
    <div className="page">
      <PageIntro title="Recurring structures for recurring work." description="Patterns give apps a familiar frame without making them identical. Use the shell, hierarchy, and state model; adapt density and explanation to the audience." />

      <section className="doc-section">
        <SectionMarker title="Operational workspace" />
        <div className="app-anatomy">
          <div className="anatomy-rail"><BifrostMark size={34} /><span /><span /><span /></div>
          <div className="anatomy-body">
            <header>
              <div><small>Accounts</small><h3>Client portfolio</h3></div>
              <div className="anatomy-actions">
                <button type="button" aria-label="Search"><Search size={18} /></button>
                <button type="button" aria-label="Notifications"><Bell size={18} /></button>
                <button className="theme-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                  <span>{theme === "dark" ? "Light" : "Dark"}</span>
                </button>
                <span className="avatar">JM</span>
              </div>
            </header>
            <div className="anatomy-toolbar"><div><BfChip tone="info">18 active</BfChip><BfChip>4 need review</BfChip></div><BfButton>New account</BfButton></div>
            <div className="anatomy-table">
              <div><strong>Northwind Logistics</strong><BfChip tone="success">Healthy</BfChip><span>Aug 12</span><MoreHorizontal size={17} /></div>
              <div><strong>Gray &amp; Finch</strong><BfChip tone="warning">Review</BfChip><span>Aug 09</span><MoreHorizontal size={17} /></div>
              <div><strong>Morrow Health</strong><BfChip tone="success">Healthy</BfChip><span>Aug 06</span><MoreHorizontal size={17} /></div>
            </div>
          </div>
        </div>
        <div className="anatomy-legend"><span><b>1</b> Stable navigation</span><span><b>2</b> Page purpose + theme</span><span><b>3</b> Local actions</span><span><b>4</b> Working surface</span></div>
      </section>

      <section className="doc-section">
        <SectionMarker title="Client moment" />
        <div className="client-pattern">
          <div className="client-pattern-copy"><span className="specimen-label">Quarterly technology plan</span><h2>Three priorities.<br />One clear next step.</h2><p>Your plan focuses investment where it reduces the most risk and gives your team room to grow.</p><BfButton>Schedule a review</BfButton></div>
          <div className="priority-list">
            {priorities.map(({ id, number, title, summary, detail, Icon }) => {
              const isOpen = openPriority === id;
              const panelId = `priority-${id}`;
              return (
                <article className={isOpen ? "is-open" : ""} key={id}>
                  <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenPriority(isOpen ? "" : id)}>
                    <span className="priority-number">{number}</span>
                    <Icon className="priority-icon" size={22} />
                    <span className="priority-copy"><strong>{title}</strong><small>{summary}</small></span>
                    <span className="priority-chevron" aria-hidden="true"><ChevronDown size={19} /></span>
                  </button>
                  <div className="priority-detail" id={panelId} aria-hidden={!isOpen}>
                    <div><p>{detail}</p></div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
