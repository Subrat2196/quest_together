import type { Difficulty } from '../types/quest';
import type { LevelInfo } from '../types/player';
import {
  XP_PER_DIFFICULTY,
  COINS_PER_DIFFICULTY,
  STREAK_MULTIPLIERS,
  DAILY_SWEEP_BONUS_XP,
  DAILY_SWEEP_BONUS_COINS,
  WEEKEND_MULTIPLIER,
  LEVEL_TITLES,
} from './constants';

export function getStreakMultiplier(streakDays: number): number {
  for (const { minDays, multiplier } of STREAK_MULTIPLIERS) {
    if (streakDays >= minDays) return multiplier;
  }
  return 1.0;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function calculateXP(
  difficulty: Difficulty,
  currentStreak: number,
  questDate: Date,
  allDailyComplete: boolean
): number {
  const baseXP = XP_PER_DIFFICULTY[difficulty];
  const streakMult = getStreakMultiplier(currentStreak);
  const weekendMult = isWeekend(questDate) ? WEEKEND_MULTIPLIER : 1.0;
  let xp = Math.floor(baseXP * streakMult * weekendMult);
  if (allDailyComplete) xp += DAILY_SWEEP_BONUS_XP;
  return xp;
}

export function calculateCoins(difficulty: Difficulty, allDailyComplete: boolean): number {
  let coins = COINS_PER_DIFFICULTY[difficulty];
  if (allDailyComplete) coins += DAILY_SWEEP_BONUS_COINS;
  return coins;
}

export function xpRequiredForLevel(level: number): number {
  return 500 + (level - 1) * 150;
}

export function calculateLevelInfo(totalXP: number): LevelInfo {
  let level = 1;
  let remaining = totalXP;
  while (remaining >= xpRequiredForLevel(level + 1)) {
    remaining -= xpRequiredForLevel(level + 1);
    level++;
  }
  const xpForNext = xpRequiredForLevel(level + 1);
  const progressPercent = Math.min((remaining / xpForNext) * 100, 100);
  return {
    level,
    currentXP: remaining,
    xpForNextLevel: xpForNext,
    progressPercent,
    title: getTitleForLevel(level),
  };
}

export function getTitleForLevel(level: number): string {
  for (const { minLevel, title } of LEVEL_TITLES) {
    if (level >= minLevel) return title;
  }
  return 'Novice Coder';
}
