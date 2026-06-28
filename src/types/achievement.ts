import type { PlayerId } from './player';

export type AchievementRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type AchievementCategory = 'MILESTONE' | 'STREAK' | 'MASTERY' | 'SPECIAL' | 'COUPLE';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  category: AchievementCategory;
  conditionType: string;
  conditionValue: number;
}

export interface PlayerAchievement {
  achievementId: string;
  playerId: PlayerId;
  currentValue: number;
  unlockedAt: string | null;
}

export const RARITY_COLORS: Record<AchievementRarity, string> = {
  COMMON: 'border-text-muted',
  RARE: 'border-quest-sysdesign',
  EPIC: 'border-primary',
  LEGENDARY: 'border-gold',
};

export const RARITY_GLOW: Record<AchievementRarity, string> = {
  COMMON: 'shadow-[0_0_10px_rgba(100,116,139,0.3)]',
  RARE: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  EPIC: 'shadow-[0_0_20px_rgba(124,58,237,0.4)]',
  LEGENDARY: 'shadow-[0_0_25px_rgba(245,158,11,0.5)]',
};
