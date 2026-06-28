import clsx from 'clsx';

interface Props {
  days: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function StreakFlame({ days, size = 'md', showLabel = true }: Props) {
  const intensity = days >= 30 ? 'inferno' : days >= 14 ? 'blazing' : days >= 7 ? 'hot' : days >= 3 ? 'warm' : 'cold';

  const sizeMap = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };
  const flameSize = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' };

  return (
    <span className={`inline-flex items-center gap-1 ${sizeMap[size]}`}>
      <span
        className={clsx(
          flameSize[size],
          'inline-block',
          intensity !== 'cold' && 'animate-flame-flicker',
          intensity === 'inferno' && 'drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]',
          intensity === 'blazing' && 'drop-shadow-[0_0_6px_rgba(249,115,22,0.4)]',
        )}
      >
        {days === 0 ? '❄️' : '🔥'}
      </span>
      {showLabel && (
        <span className={clsx(
          'font-medium tabular-nums',
          intensity === 'inferno' && 'text-fire',
          intensity === 'blazing' && 'text-fire-warm',
          intensity === 'hot' && 'text-fire-warm',
          intensity === 'warm' && 'text-gold',
          intensity === 'cold' && 'text-text-muted',
        )}>
          {days}
        </span>
      )}
    </span>
  );
}
