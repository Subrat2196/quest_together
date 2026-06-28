import type { PlayerId } from './player';

export type QuestCategory = 'LEETCODE' | 'SYSTEM_DESIGN' | 'DOMAIN' | 'PROJECT';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Quest {
  id: string;
  playerId: PlayerId;
  questDate: string;
  category: QuestCategory;
  title: string;
  description: string;
  difficulty: Difficulty;
  completed: boolean;
  completedAt: string | null;
  xpEarned: number;
  coinsEarned: number;
  notes: string;
  timeSpentMin: number | null;
}

export interface QuestCompletionResult {
  xpEarned: number;
  coinsEarned: number;
  streakUpdate: { current: number; isNewRecord: boolean };
  levelUp: { occurred: boolean; newLevel: number; newTitle: string } | null;
  achievementsUnlocked: string[];
  dailyBonusApplied: boolean;
  multiplier: number;
}

export const QUEST_CATEGORIES: { key: QuestCategory; label: string; emoji: string; color: string }[] = [
  { key: 'LEETCODE', label: 'LeetCode', emoji: '🧠', color: 'text-quest-leetcode' },
  { key: 'SYSTEM_DESIGN', label: 'System Design', emoji: '🏗️', color: 'text-quest-sysdesign' },
  { key: 'DOMAIN', label: 'Domain Study', emoji: '📚', color: 'text-quest-domain' },
  { key: 'PROJECT', label: 'Project Work', emoji: '🚀', color: 'text-quest-project' },
];

export const QUEST_CATEGORY_MAP: Record<QuestCategory, typeof QUEST_CATEGORIES[number]> =
  Object.fromEntries(QUEST_CATEGORIES.map(c => [c.key, c])) as Record<QuestCategory, typeof QUEST_CATEGORIES[number]>;
