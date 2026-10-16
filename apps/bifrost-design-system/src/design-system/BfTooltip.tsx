import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import "./components.css";

/** Supplemental help that floats above the layout on hover or keyboard focus. */
export function BfTooltip({ label, content, children }: { label: string; content: ReactNode; children: ReactNode }) {
  const id = useId();
  const anchor = useRef<HTMLButtonElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const closing = useRef<ReturnType<typeof setTimeout>>();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<CSSProperties>();
  const cancelClose = () => { if (closing.current) clearTimeout(closing.current); };
  const reveal = () => { cancelClose(); window.dispatchEvent(new CustomEvent("bds:tooltip-open", { detail: anchor.current })); setOpen(true); };
  const conceal = () => { cancelClose(); setOpen(false); setPosition(undefined); };
  const leave = () => { cancelClose(); closing.current = setTimeout(conceal, 120); };

  useEffect(() => () => { if (closing.current) clearTimeout(closing.current); }, []);
  useEffect(() => {
    const dismissOther = (event: Event) => {
      if ((event as CustomEvent).detail === anchor.current) return;
      if (closing.current) clearTimeout(closing.current);
      setOpen(false);
      setPosition(undefined);
    };
    window.addEventListener("bds:tooltip-open", dismissOther);
    return () => window.removeEventListener("bds:tooltip-open", dismissOther);
  }, []);

  useLayoutEffect(() => {
    if (!open || !anchor.current || !bubble.current) return;
    const source = anchor.current.getBoundingClientRect();
    const tip = bubble.current.getBoundingClientRect();
    const left = Math.max(8, Math.min(source.left, window.innerWidth - tip.width - 8));
    const top = source.bottom + tip.height + 16 <= window.innerHeight ? source.bottom + 8 : Math.max(8, source.top - tip.height - 8);
    setPosition({ left, top, visibility: "visible" });
  }, [open, content]);
  useEffect(() => {
    if (!open) return;
    const dismiss = () => { cancelClose(); setOpen(false); setPosition(undefined); };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      dismiss();
    };
    window.addEventListener("keydown", escape, true);
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      window.removeEventListener("keydown", escape, true);
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, [open]);

  return <><button ref={anchor} type="button" className="bds-tooltip__trigger" aria-label={label} aria-describedby={open ? id : undefined} onMouseEnter={reveal} onMouseLeave={leave} onFocus={reveal} onBlur={conceal}>{children}</button>{open && createPortal(<div ref={bubble} id={id} role="tooltip" className="bds-tooltip" style={position ?? { visibility: "hidden" }} onMouseEnter={cancelClose} onMouseLeave={leave}>{content}</div>, anchor.current?.closest("dialog") ?? document.body)}</>;
}
