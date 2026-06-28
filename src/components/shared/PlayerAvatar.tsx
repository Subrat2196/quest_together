import clsx from 'clsx';

interface Props {
  emoji: string;
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showCrown?: boolean;
  isLeader?: boolean;
}

function getRingColor(level: number): string {
  if (level >= 30) return 'ring-[#B9F2FF] shadow-[0_0_12px_rgba(185,242,255,0.3)]';
  if (level >= 20) return 'ring-[#E5E4E2] shadow-[0_0_10px_rgba(229,228,226,0.2)]';
  if (level >= 10) return 'ring-gold shadow-[0_0_10px_rgba(245,158,11,0.2)]';
  if (level >= 5) return 'ring-[#C0C0C0]';
  return 'ring-[#CD7F32]';
}

export default function PlayerAvatar({ emoji, level, size = 'md', showCrown, isLeader }: Props) {
  const sizeMap = {
    sm: 'w-9 h-9 text-lg ring-[1.5px]',
    md: 'w-13 h-13 text-2xl ring-2',
    lg: 'w-18 h-18 text-4xl ring-[2.5px]',
  };

  return (
    <div className="relative inline-flex">
      <div
        className={clsx(
          'rounded-full bg-bg-elevated flex items-center justify-center transition-shadow duration-300',
          sizeMap[size],
          getRingColor(level),
        )}
      >
        {emoji}
      </div>
      {showCrown && isLeader && (
        <span className="absolute -top-1.5 -right-0.5 text-xs drop-shadow-lg">👑</span>
      )}
    </div>
  );
}
