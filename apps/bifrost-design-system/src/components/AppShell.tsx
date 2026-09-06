import { useBifrostContext } from "bifrost";
import { BookOpen, Box, Grid2X2, Layers3, Activity, Menu, Moon, Sun, TerminalSquare, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { BifrostSignature } from "../design-system/BifrostSignature";
import { BfSwitch } from "../design-system/BfSelection";
import type { Density } from "../design-system/types";

const navItems: Array<{ to: string; label: string; icon: LucideIcon; end?: boolean }> = [
  { to: "/", label: "Field guide", icon: BookOpen, end: true },
  { to: "/foundations", label: "Foundations", icon: Layers3 },
  { to: "/components", label: "Components", icon: Box },
  { to: "/execution", label: "Execution stream", icon: Activity },
  { to: "/patterns", label: "App patterns", icon: Grid2X2 },
  { to: "/start", label: "Start building", icon: TerminalSquare },
];

export interface CatalogContext {
  density: Density;
  setDensity: (density: Density) => void;
}

export function AppShell() {
  const { theme, toggleTheme } = useBifrostContext();
  const [density, setDensity] = useState<Density>("comfortable");
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="catalog-shell" data-density={density}>
      <header className="mobile-header">
        <NavLink className="mobile-brand" to="/" aria-label="Bifrost Design System home">
          <BifrostSignature markSize={30} />
        </NavLink>
        <div className="mobile-actions">
          <button className="icon-button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="icon-button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle navigation">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <aside className={`catalog-rail ${menuOpen ? "is-open" : ""}`}>
        <div>
          <NavLink className="rail-brand" to="/" onClick={() => setMenuOpen(false)}>
            <BifrostSignature />
          </NavLink>
          <nav className="rail-nav" aria-label="Design system sections">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                <item.icon size={17} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="rail-footer">
          <div className="rail-theme">
            <BfSwitch checked={theme === "dark"} onChange={toggleTheme} label="Appearance" description={`${theme === "dark" ? "Dark" : "Light"} mode`} ariaLabel={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} />
          </div>
          <div className="rail-version"><span className="status-dot" /><span>v0.1 · Working standard</span></div>
        </div>
      </aside>

      {menuOpen && <button className="rail-scrim" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}

      <main className="catalog-main" key={location.pathname} ref={mainRef}>
        <Outlet context={{ density, setDensity } satisfies CatalogContext} />
      </main>
    </div>
  );
}
