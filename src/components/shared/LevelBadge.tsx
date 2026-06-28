import clsx from 'clsx';

interface Props {
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

function getTierColor(level: number): string {
  if (level >= 30) return 'border-[#B9F2FF] text-[#B9F2FF]';
  if (level >= 20) return 'border-[#E5E4E2] text-[#E5E4E2]';
  if (level >= 10) return 'border-gold text-gold';
  if (level >= 5) return 'border-[#C0C0C0] text-[#C0C0C0]';
  return 'border-[#CD7F32] text-[#CD7F32]';
}

export default function LevelBadge({ level, size = 'md' }: Props) {
  const sizeMap = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={clsx(
        'rounded-full border-2 flex items-center justify-center font-bold',
        sizeMap[size],
        getTierColor(level),
      )}
    >
      {level}
    </div>
  );
}
