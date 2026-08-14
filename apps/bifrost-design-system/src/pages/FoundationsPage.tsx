import { Download } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import type { CatalogContext } from "../components/AppShell";
import { DensityControl } from "../components/DensityControl";
import { PageIntro } from "../components/PageIntro";
import { SectionMarker } from "../components/SectionMarker";
import { BifrostMark } from "../design-system/BifrostMark";

const colors = [
  ["Canvas", "#08090B", "Dark-first product canvas"], ["Surface", "#0A0C0F", "Raised structure"],
  ["Bifrost cyan", "#2FD4D4", "Action and focus"], ["Foreground", "#F7F9FB", "Primary text"],
  ["Bridge red", "#FF5A5A", "Spectrum start"], ["Bridge orange", "#FFB24D", "Spectrum"],
  ["Bridge green", "#3AD17A", "Spectrum"], ["Bridge blue", "#4D6BFF", "Spectrum"],
  ["Bridge magenta", "#D96BFF", "Spectrum end"],
] as const;

export function FoundationsPage() {
  const { density, setDensity } = useOutletContext<CatalogContext>();

  return (
    <div className="page">
      <PageIntro title="A small vocabulary, used deliberately." description="The palette is decisive, the type hierarchy is clear, and density responds to the work—not a second brand." />

      <section className="doc-section">
        <SectionMarker title="Logo" />
        <div className="logo-foundation">
          <div className="logo-lockup">
            <span className="specimen-label">Native wordmark</span>
            <img src="/brand/logo-wordmark.svg" alt="Bifrost" />
          </div>
          <div className="logo-mark logo-mark--light">
            <span className="specimen-label">Square mark</span>
            <BifrostMark size={74} />
          </div>
          <div className="logo-mark logo-mark--light">
            <span className="specimen-label">Compact mark</span>
            <BifrostMark size={74} />
          </div>
          <div className="logo-mark logo-mark--dark">
            <span className="specimen-label">Dark surface</span>
            <BifrostMark size={74} />
          </div>
        </div>
        <div className="logo-guidance">
          <p><strong>Use the lockup</strong> for a Bifrost-owned entrance, report masthead, or branded client moment.</p>
          <p><strong>Use the mark</strong> where the product context already names Bifrost: app rails, favicons, and compact headers.</p>
        </div>
        <div className="logo-assets" aria-label="Download Bifrost logo SVGs">
          <a href="/brand/logo-wordmark.svg" download><span>Horizontal wordmark</span><small>SVG · website master</small><Download size={15} /></a>
          <a href="/brand/logo-square.svg" download><span>Square mark</span><small>SVG · website master</small><Download size={15} /></a>
          <a href="/favicon.svg" download><span>Favicon</span><small>SVG · website master</small><Download size={15} /></a>
        </div>
      </section>

      <section className="doc-section">
        <SectionMarker title="Color" />
        <div className="color-grid">
          {colors.map(([name, value, use]) => (
            <article className="color-swatch" key={name}>
              <div style={{ backgroundColor: value }} />
              <h3>{name}</h3><code>{value}</code><p>{use}</p>
            </article>
          ))}
        </div>
        <p className="annotation"><strong>The bridge rule.</strong> The full spectrum communicates connection, route continuity, transfer, or progress. Use cyan alone for action and focus; never fill ordinary controls with the whole gradient.</p>
      </section>

      <section className="doc-section">
        <SectionMarker title="Typography" />
        <div className="type-specimen">
          <div className="type-display"><span>Display · Prompt 600</span><p>Make the purpose unmistakable.</p></div>
          <div className="type-row"><span>Headline · Prompt 600</span><p>Clear hierarchy for recurring work</p></div>
          <div className="type-row type-row--body"><span>Body · Inter 400</span><p>Direct language that stays readable through explanations, guidance, and product detail.</p></div>
          <div className="type-row type-row--label"><span>Code · JetBrains Mono 400</span><p>npm run registry:build</p></div>
        </div>
      </section>

      <section className="doc-section">
        <SectionMarker title="Motion" />
        <div className="motion-foundation">
          <div className="motion-bridge-demo" aria-label="Animated Bifrost bridge"><span /></div>
          <div className="motion-token-list">
            <p><strong>Feedback · 120ms</strong><span>Hover, press, focus, and local acknowledgement.</span></p>
            <p><strong>Disclosure · 220ms</strong><span>Accordion, menu, and compact spatial change.</span></p>
            <p><strong>Route · 360ms</strong><span>Short continuity between catalog destinations.</span></p>
            <p><strong>Progress · 1600ms</strong><span>The only repeating motion; always paired with real busy state.</span></p>
          </div>
        </div>
        <p className="annotation"><strong>Reduced motion.</strong> Translation, blur, clipping, rotation, and loops stop. Content remains visible and state changes stay immediate.</p>
      </section>

      <section className="doc-section">
        <SectionMarker title="Density" />
        <div className="density-foundation">
          <div><h3>Rhythm follows familiarity.</h3><p>Choose a default from task frequency, information complexity, and audience confidence. Keep meaning and brand constant.</p></div>
          <DensityControl value={density} onChange={setDensity} detailed />
        </div>
        <div className="density-ruler" aria-label={`${density} density example`}>
          <div><span>Quarterly planning</span><small>Updated today</small></div>
          <div><span>Service health review</span><small>3 open actions</small></div>
          <div><span>Security roadmap</span><small>Next meeting Aug 21</small></div>
        </div>
      </section>
    </div>
  );
}
