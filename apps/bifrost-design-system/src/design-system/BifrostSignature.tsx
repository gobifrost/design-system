import { BifrostMark } from "./BifrostMark";

export function BifrostSignature({ markSize = 42 }: { markSize?: number }) {
  return (
    <>
      <BifrostMark size={markSize} />
      <span className="brand-signature__copy">
        <strong>Bifrost</strong>
        <small>Design system</small>
      </span>
    </>
  );
}
