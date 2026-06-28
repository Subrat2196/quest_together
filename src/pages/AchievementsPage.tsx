import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import ProgressBar from '../components/shared/ProgressBar';
import type { AchievementCategory } from '../types/achievement';
import { RARITY_COLORS, RARITY_GLOW } from '../types/achievement';

type Filter = 'ALL' | 'UNLOCKED' | 'PROGRESS' | 'LOCKED';

const CATEGORY_LABELS: Record<AchievementCategory, { label: string; emoji: string }> = {
  MILESTONE: { label: 'Milestones', emoji: '🏆' },
  STREAK: { label: 'Streaks', emoji: '🔥' },
  MASTERY: { label: 'Category Mastery', emoji: '🎯' },
  SPECIAL: { label: 'Special', emoji: '⭐' },
  COUPLE: { label: 'Couple', emoji: '💕' },
};

export default function AchievementsPage() {
  const { playerAchievements, achievements, activePlayer, getAchievementProgress } = useGame();
  const [filter, setFilter] = useState<Filter>('ALL');

  const unlockedIds = new Set(
    playerAchievements
      .filter(pa => pa.playerId === activePlayer.id && pa.unlockedAt)
      .map(pa => pa.achievementId)
  );

  const totalUnlocked = unlockedIds.size;

  const enriched = achievements.map(a => {
    const progress = getAchievementProgress(activePlayer.id, a);
    const isUnlocked = unlockedIds.has(a.id);
    return { ...a, progress, isUnlocked, pct: Math.min((progress / a.conditionValue) * 100, 100) };
  });

  const filtered = enriched.filter(a => {
    if (filter === 'UNLOCKED') return a.isUnlocked;
    if (filter === 'PROGRESS') return !a.isUnlocked && a.progress > 0;
    if (filter === 'LOCKED') return !a.isUnlocked && a.progress === 0;
    return true;
  });

  const categories = (['MILESTONE', 'STREAK', 'MASTERY', 'SPECIAL', 'COUPLE'] as AchievementCategory[])
    .map(cat => ({
      ...CATEGORY_LABELS[cat],
      key: cat,
      items: filtered.filter(a => a.category === cat),
    }))
    .filter(cat => cat.items.length > 0);

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'ALL', label: 'All', count: enriched.length },
    { key: 'UNLOCKED', label: 'Unlocked', count: enriched.filter(a => a.isUnlocked).length },
    { key: 'PROGRESS', label: 'In Progress', count: enriched.filter(a => !a.isUnlocked && a.progress > 0).length },
    { key: 'LOCKED', label: 'Locked', count: enriched.filter(a => !a.isUnlocked && a.progress === 0).length },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Achievements</h1>
        <span className="text-sm text-text-muted">{totalUnlocked}/{achievements.length} Unlocked</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f.key ? 'bg-primary text-white' : 'bg-bg-card text-text-muted border border-border'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Achievement Categories */}
      {categories.map(cat => (
        <div key={cat.key}>
          <div className="text-sm font-semibold mb-2 flex items-center gap-1.5">
            <span>{cat.emoji}</span> {cat.label}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {cat.items.map(achievement => (
              <motion.div
                key={achievement.id}
                layout
                className={`rounded-xl p-2.5 border-2 text-center transition-all ${
                  achievement.isUnlocked
                    ? `${RARITY_COLORS[achievement.rarity]} ${RARITY_GLOW[achievement.rarity]} bg-bg-card`
                    : 'border-border bg-bg-card/50 opacity-60'
                }`}
              >
                <div className={`text-2xl mb-1 ${achievement.isUnlocked ? '' : 'grayscale'}`}>
                  {achievement.isUnlocked ? achievement.icon : '🔒'}
                </div>
                <div className="text-[10px] font-medium text-text-primary leading-tight mb-1">
                  {achievement.isUnlocked ? achievement.name : '???'}
                </div>
                {achievement.isUnlocked ? (
                  <div className="text-[9px] text-success">✓</div>
                ) : achievement.progress > 0 ? (
                  <div>
                    <ProgressBar value={achievement.progress} max={achievement.conditionValue} height="sm" />
                    <div className="text-[9px] text-text-muted mt-0.5">
                      {achievement.progress}/{achievement.conditionValue}
                    </div>
                  </div>
                ) : (
                  <div className="text-[9px] text-text-muted">{achievement.rarity}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
