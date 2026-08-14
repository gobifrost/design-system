import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { PageIntro } from "../components/PageIntro";
import { SectionMarker } from "../components/SectionMarker";
import { CopyCode } from "../design-system/CopyCode";

const tokenCode = `node scripts/add.mjs button --root ../your-app

// your-app/src/main.tsx
import "./components/bifrost/tokens.css";

// any React surface
import { BfButton } from "./components/bifrost/BfButton";

<main data-density="comfortable">
  <BfButton>Continue</BfButton>
</main>`;

const decisions = ["Who uses this, and how often?", "What must be visible at the same time?", "Which single action moves the work forward?", "What happens when data is empty, late, denied, or wrong?"];

export function StartPage() {
  return (
    <div className="page">
      <PageIntro title="Begin with the work, then choose the rhythm." description="A Bifrost app starts with audience, task frequency, and information shape. The visual layer follows those decisions." />

      <section className="build-steps">
        <article><span>01</span><div><h2>Frame the work</h2><p>Write the primary job, the user’s level of familiarity, and what success looks like before choosing a layout.</p></div></article>
        <article><span>02</span><div><h2>Choose density</h2><p>Compact for repeated expert work, comfortable for everyday apps, spacious for client-facing or infrequent moments.</p></div></article>
        <article><span>03</span><div><h2>Copy source, then compose</h2><p>Use the registry helper to bring readable component source into the app. Review the diff, keep the behavioral contract, and adapt from there.</p></div></article>
        <article><span>04</span><div><h2>Fortify every state</h2><p>Design empty, loading, error, success, permission, and destructive paths as part of the original experience.</p></div></article>
      </section>

      <section className="doc-section start-kit">
        <SectionMarker title="Starter layer" />
        <div className="start-grid">
          <div><h2>Bring the system into an app.</h2><p>Run the source copier from this repository, import the token layer once, and let the Bifrost provider own light and dark theme state.</p><CopyCode code={tokenCode} /></div>
          <aside><span className="specimen-label">Before the first component</span>{decisions.map((decision) => <p key={decision}><Check size={15} />{decision}</p>)}</aside>
        </div>
      </section>

      <footer className="next-link"><span>Ready to inspect the pieces?</span><Link to="/components">Open the workbench <ArrowRight size={16} /></Link></footer>
    </div>
  );
}
