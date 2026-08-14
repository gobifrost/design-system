interface PageIntroProps {
  title: string;
  description: string;
}

export function PageIntro({ title, description }: PageIntroProps) {
  return (
    <header className="page-intro">
      <div>
        <h1>{title}</h1>
        <p className="lede">{description}</p>
      </div>
    </header>
  );
}
