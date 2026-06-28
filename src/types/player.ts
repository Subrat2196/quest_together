export type PlayerId = 'player1' | 'player2';

export interface Player {
  id: PlayerId;
  name: string;
  avatarEmoji: string;
  xp: number;
  coins: number;
  level: number;
  title: string;
  currentStreak: number;
  longestStreak: number;
  lastQuestDate: string | null;
  joinedDate: string;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
}

export interface LevelInfo {
  level: number;
  currentXP: number;
  xpForNextLevel: number;
  progressPercent: number;
  title: string;
}
