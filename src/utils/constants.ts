import type { Difficulty } from '../types/quest';

export const XP_PER_DIFFICULTY: Record<Difficulty, number> = {
  EASY: 50,
  MEDIUM: 100,
  HARD: 175,
};

export const COINS_PER_DIFFICULTY: Record<Difficulty, number> = {
  EASY: 5,
  MEDIUM: 10,
  HARD: 18,
};

export const STREAK_MULTIPLIERS: { minDays: number; multiplier: number }[] = [
  { minDays: 30, multiplier: 2.0 },
  { minDays: 14, multiplier: 1.75 },
  { minDays: 7, multiplier: 1.5 },
  { minDays: 3, multiplier: 1.25 },
  { minDays: 0, multiplier: 1.0 },
];

export const DAILY_SWEEP_BONUS_XP = 100;
export const DAILY_SWEEP_BONUS_COINS = 10;
export const WEEKEND_MULTIPLIER = 1.25;

export const LEVEL_TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 30, title: 'Legendary Engineer' },
  { minLevel: 25, title: 'Tech Sage' },
  { minLevel: 20, title: 'Code Warrior' },
  { minLevel: 15, title: 'System Architect' },
  { minLevel: 10, title: 'Algorithm Adept' },
  { minLevel: 5, title: 'Code Apprentice' },
  { minLevel: 1, title: 'Novice Coder' },
];

export const MOTIVATIONAL_MESSAGES = [
  "You two are unstoppable! Keep the fire alive! 🔥",
  "Every quest brings you closer to your dream job! 💪",
  "MAANG is not a dream — it's a plan. Execute it! 🎯",
  "Consistency beats intensity. Show up every day! ⚡",
  "Your future selves will thank you for today's effort! 🌟",
  "Two engineers, one mission. Let's crush it! 🚀",
  "The streak is real. Don't let it die! 🔥",
  "Small daily improvements lead to stunning results! ✨",
  "You're not just studying — you're leveling up your life! 🎮",
  "Imagine the interview confidence you're building right now! 💎",
  "Bangalore cafes await your coin redemptions! ☕",
  "Power couple energy! Both grinding, both growing! 💕",
  "One quest at a time. One day at a time. You've got this! 🏆",
  "The competition is friendly, the growth is real! 🌱",
  "Today's hard work is tomorrow's easy interview! 🧠",
];
