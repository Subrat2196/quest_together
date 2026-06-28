import { motion } from 'framer-motion';
import { calculateLevelInfo } from '../../utils/xpCalculator';

interface Props {
  totalXP: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function XPProgressBar({ totalXP, size = 'md', showLabel = true }: Props) {
  const info = calculateLevelInfo(totalXP);
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };

  return (
    <div className="w-full">
      <div className={`w-full bg-bg-elevated rounded-full overflow-hidden ${heights[size]} relative`}>
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary via-primary-light to-primary relative"
          initial={{ width: 0 }}
          animate={{ width: `${info.progressPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {size !== 'sm' && info.progressPercent > 15 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
          )}
        </motion.div>
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-[10px] text-text-muted">
          <span>{info.currentXP.toLocaleString()} / {info.xpForNextLevel.toLocaleString()} XP</span>
          <span className="text-text-secondary font-medium">Lvl {info.level + 1}</span>
        </div>
      )}
    </div>
  );
}
