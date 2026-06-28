import clsx from 'clsx';

interface Props {
  value: number;
  max: number;
  color?: string;
  height?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function ProgressBar({ value, max, color = 'bg-primary', height = 'md', showText }: Props) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className="w-full">
      <div className={clsx('w-full bg-bg-elevated rounded-full overflow-hidden', heights[height])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showText && (
        <div className="text-xs text-text-muted mt-0.5 text-right">
          {value}/{max}
        </div>
      )}
    </div>
  );
}
