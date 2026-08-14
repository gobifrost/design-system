interface BifrostMarkProps {
  size?: number;
  className?: string;
}

export function BifrostMark({ size = 32, className }: BifrostMarkProps) {
  return <img className={className} src="/brand/logo-square.svg" width={size} height={size} alt="Bifrost" />;
}
