interface SectionMarkerProps {
  title: string;
  id?: string;
}

export function SectionMarker({ title, id }: SectionMarkerProps) {
  return (
    <div className="section-marker" id={id}>
      <span aria-hidden="true" />
      <h2>{title}</h2>
      <div aria-hidden="true" />
    </div>
  );
}
