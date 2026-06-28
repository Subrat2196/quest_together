import type { Player } from '../types/player';
import type { Reward } from '../types/reward';
import type { Achievement } from '../types/achievement';
import { todayStr } from './dateUtils';

export const SEED_PLAYERS: Player[] = [
  {
    id: 'player1',
    name: 'Player 1',
    avatarEmoji: '🧑‍💻',
    xp: 0,
    coins: 0,
    level: 1,
    title: 'Novice Coder',
    currentStreak: 0,
    longestStreak: 0,
    lastQuestDate: null,
    joinedDate: todayStr(),
    totalCoinsEarned: 0,
    totalCoinsSpent: 0,
  },
  {
    id: 'player2',
    name: 'Player 2',
    avatarEmoji: '👩‍💻',
    xp: 0,
    coins: 0,
    level: 1,
    title: 'Novice Coder',
    currentStreak: 0,
    longestStreak: 0,
    lastQuestDate: null,
    joinedDate: todayStr(),
    totalCoinsEarned: 0,
    totalCoinsSpent: 0,
  },
];

export const SEED_REWARDS: Reward[] = [
  // Small Rewards (25-80)
  { id: 'r1', name: 'Chai Date', description: 'Tapri chai together', coinCost: 25, tier: 'SMALL', emoji: '🍵', active: true, redeemedCount: 0 },
  { id: 'r2', name: 'Favorite Chocolate', description: 'Pick any chocolate bar', coinCost: 30, tier: 'SMALL', emoji: '🍫', active: true, redeemedCount: 0 },
  { id: 'r3', name: 'Evening Walk + Kulfi', description: 'Walk and kulfi stop', coinCost: 35, tier: 'SMALL', emoji: '🍦', active: true, redeemedCount: 0 },
  { id: 'r4', name: 'Favorite Snack', description: 'Any snack from the store', coinCost: 35, tier: 'SMALL', emoji: '🍿', active: true, redeemedCount: 0 },
  { id: 'r5', name: 'TV Episode', description: 'Watch 1 episode together guilt-free', coinCost: 40, tier: 'SMALL', emoji: '📺', active: true, redeemedCount: 0 },
  { id: 'r6', name: 'PS5 Session', description: '30-minute PS5 session', coinCost: 40, tier: 'SMALL', emoji: '🎮', active: true, redeemedCount: 0 },
  { id: 'r7', name: 'Board Game Time', description: 'Play one board game together', coinCost: 40, tier: 'SMALL', emoji: '🎲', active: true, redeemedCount: 0 },
  { id: 'r8', name: 'Popcorn + Short Movie', description: 'Make popcorn, pick a short movie', coinCost: 45, tier: 'SMALL', emoji: '🍿', active: true, redeemedCount: 0 },
  { id: 'r9', name: 'Bubble Tea', description: 'Order your favorite bubble tea', coinCost: 50, tier: 'SMALL', emoji: '🧋', active: true, redeemedCount: 0 },
  { id: 'r10', name: 'Ice Cream', description: 'Corner House or Naturals', coinCost: 50, tier: 'SMALL', emoji: '🍨', active: true, redeemedCount: 0 },
  { id: 'r11', name: 'Coffee Date', description: 'Third Wave or Blue Tokai', coinCost: 60, tier: 'SMALL', emoji: '☕', active: true, redeemedCount: 0 },
  { id: 'r12', name: 'Dessert Outing', description: 'Aubree or favorite bakery', coinCost: 60, tier: 'SMALL', emoji: '🍰', active: true, redeemedCount: 0 },
  { id: 'r13', name: 'Street Food Order', description: 'Order favorite street food', coinCost: 55, tier: 'SMALL', emoji: '🥘', active: true, redeemedCount: 0 },
  { id: 'r14', name: 'Breakfast in Bed', description: 'Partner makes breakfast in bed', coinCost: 70, tier: 'SMALL', emoji: '🥞', active: true, redeemedCount: 0 },
  { id: 'r15', name: 'Sleep-in Pass', description: 'One guilt-free sleep in, no alarm', coinCost: 80, tier: 'SMALL', emoji: '😴', active: true, redeemedCount: 0 },

  // Medium Rewards (100-250)
  { id: 'r16', name: 'Movie Night', description: 'PVR + popcorn combo', coinCost: 100, tier: 'MEDIUM', emoji: '🎬', active: true, redeemedCount: 0 },
  { id: 'r17', name: 'Cafe Hopping', description: 'Visit 2 cafes in one trip', coinCost: 120, tier: 'MEDIUM', emoji: '☕', active: true, redeemedCount: 0 },
  { id: 'r18', name: 'Brunch Date', description: 'Nice brunch spot', coinCost: 120, tier: 'MEDIUM', emoji: '🥂', active: true, redeemedCount: 0 },
  { id: 'r19', name: 'Dinner Date', description: 'Mid-range restaurant', coinCost: 150, tier: 'MEDIUM', emoji: '🍽️', active: true, redeemedCount: 0 },
  { id: 'r20', name: 'New Book', description: 'Buy any book you want', coinCost: 100, tier: 'MEDIUM', emoji: '📖', active: true, redeemedCount: 0 },
  { id: 'r21', name: 'New Restaurant', description: 'Try somewhere completely new', coinCost: 150, tier: 'MEDIUM', emoji: '🍜', active: true, redeemedCount: 0 },
  { id: 'r22', name: 'Bowling', description: 'Bowling alley date', coinCost: 150, tier: 'MEDIUM', emoji: '🎳', active: true, redeemedCount: 0 },
  { id: 'r23', name: 'Mini Shopping', description: 'Small shopping trip', coinCost: 180, tier: 'MEDIUM', emoji: '🛍️', active: true, redeemedCount: 0 },
  { id: 'r24', name: 'Bake Together', description: 'Pick a recipe, bake it together', coinCost: 100, tier: 'MEDIUM', emoji: '🧁', active: true, redeemedCount: 0 },
  { id: 'r25', name: 'Long Drive + Chai', description: 'Drive to the outskirts, find a chai stop', coinCost: 120, tier: 'MEDIUM', emoji: '🚗', active: true, redeemedCount: 0 },
  { id: 'r26', name: 'Picnic', description: 'Cubbon Park picnic', coinCost: 100, tier: 'MEDIUM', emoji: '🧺', active: true, redeemedCount: 0 },
  { id: 'r27', name: 'Arcade Date', description: 'Timezone or Smaaash', coinCost: 150, tier: 'MEDIUM', emoji: '🕹️', active: true, redeemedCount: 0 },
  { id: 'r28', name: 'Karaoke Night', description: 'Sing your hearts out', coinCost: 150, tier: 'MEDIUM', emoji: '🎤', active: true, redeemedCount: 0 },
  { id: 'r29', name: 'Sunset Point + Chai', description: 'Catch the sunset together', coinCost: 100, tier: 'MEDIUM', emoji: '🌅', active: true, redeemedCount: 0 },
  { id: 'r30', name: 'Cloud Kitchen Order', description: 'Order from a fancy cloud kitchen', coinCost: 130, tier: 'MEDIUM', emoji: '🍕', active: true, redeemedCount: 0 },

  // Premium Rewards (300-800)
  { id: 'r31', name: 'Shopping Budget', description: 'INR 3000 shopping spree', coinCost: 400, tier: 'PREMIUM', emoji: '🛒', active: true, redeemedCount: 0 },
  { id: 'r32', name: 'Spa Day', description: 'Book a spa appointment', coinCost: 350, tier: 'PREMIUM', emoji: '💆', active: true, redeemedCount: 0 },
  { id: 'r33', name: 'Weekend Resort', description: 'Resort near Bangalore', coinCost: 800, tier: 'PREMIUM', emoji: '🏖️', active: true, redeemedCount: 0 },
  { id: 'r34', name: 'One-Day Trip', description: 'Nandi Hills or Mysore', coinCost: 500, tier: 'PREMIUM', emoji: '🗺️', active: true, redeemedCount: 0 },
  { id: 'r35', name: 'LEGO Set', description: 'Pick any LEGO set', coinCost: 400, tier: 'PREMIUM', emoji: '🧱', active: true, redeemedCount: 0 },
  { id: 'r36', name: 'Fancy Dinner', description: 'Fine dining experience', coinCost: 400, tier: 'PREMIUM', emoji: '🥩', active: true, redeemedCount: 0 },
  { id: 'r37', name: 'Couple Massage', description: 'Book a couple massage', coinCost: 350, tier: 'PREMIUM', emoji: '💆‍♂️', active: true, redeemedCount: 0 },
  { id: 'r38', name: 'Theme Park', description: 'Wonderla adventure', coinCost: 450, tier: 'PREMIUM', emoji: '🎢', active: true, redeemedCount: 0 },
  { id: 'r39', name: 'Concert', description: 'Live show or concert', coinCost: 500, tier: 'PREMIUM', emoji: '🎵', active: true, redeemedCount: 0 },
  { id: 'r40', name: 'Trek', description: 'Skandagiri or Savandurga', coinCost: 350, tier: 'PREMIUM', emoji: '🥾', active: true, redeemedCount: 0 },
  { id: 'r41', name: 'Staycation', description: 'One night city hotel', coinCost: 600, tier: 'PREMIUM', emoji: '🏨', active: true, redeemedCount: 0 },
  { id: 'r42', name: 'Gadget Fund', description: 'INR 3-5K toward a gadget', coinCost: 500, tier: 'PREMIUM', emoji: '📱', active: true, redeemedCount: 0 },
  { id: 'r43', name: 'PS5 Game', description: 'Buy a new PS5 game', coinCost: 400, tier: 'PREMIUM', emoji: '🎮', active: true, redeemedCount: 0 },
  { id: 'r44', name: 'Board Game', description: 'Buy a premium board game', coinCost: 300, tier: 'PREMIUM', emoji: '♟️', active: true, redeemedCount: 0 },
  { id: 'r45', name: 'Escape Room', description: 'Escape room experience', coinCost: 350, tier: 'PREMIUM', emoji: '🔐', active: true, redeemedCount: 0 },
  { id: 'r46', name: 'Cooking Class', description: 'Take a cooking class together', coinCost: 400, tier: 'PREMIUM', emoji: '👨‍🍳', active: true, redeemedCount: 0 },
  { id: 'r47', name: 'Pottery Class', description: 'Pottery or art class date', coinCost: 350, tier: 'PREMIUM', emoji: '🏺', active: true, redeemedCount: 0 },
  { id: 'r48', name: 'Go-Karting', description: 'Go-karting race date', coinCost: 350, tier: 'PREMIUM', emoji: '🏎️', active: true, redeemedCount: 0 },
];

export const SEED_ACHIEVEMENTS: Achievement[] = [
  // Milestone
  { id: 'a1', name: 'First Steps', description: 'Complete your first quest', icon: '👣', rarity: 'COMMON', category: 'MILESTONE', conditionType: 'TOTAL_QUESTS', conditionValue: 1 },
  { id: 'a2', name: 'Getting Warmed Up', description: 'Complete 25 quests', icon: '⭐', rarity: 'COMMON', category: 'MILESTONE', conditionType: 'TOTAL_QUESTS', conditionValue: 25 },
  { id: 'a3', name: 'Half Century', description: 'Complete 50 quests', icon: '🥈', rarity: 'RARE', category: 'MILESTONE', conditionType: 'TOTAL_QUESTS', conditionValue: 50 },
  { id: 'a4', name: 'Century Club', description: 'Complete 100 quests', icon: '💯', rarity: 'EPIC', category: 'MILESTONE', conditionType: 'TOTAL_QUESTS', conditionValue: 100 },
  { id: 'a5', name: 'Quest Machine', description: 'Complete 200 quests', icon: '🤖', rarity: 'LEGENDARY', category: 'MILESTONE', conditionType: 'TOTAL_QUESTS', conditionValue: 200 },

  // Streak
  { id: 'a6', name: 'Spark', description: '3-day streak', icon: '✨', rarity: 'COMMON', category: 'STREAK', conditionType: 'STREAK', conditionValue: 3 },
  { id: 'a7', name: 'On Fire', description: '7-day streak', icon: '🔥', rarity: 'RARE', category: 'STREAK', conditionType: 'STREAK', conditionValue: 7 },
  { id: 'a8', name: 'Blazing', description: '14-day streak', icon: '🌋', rarity: 'EPIC', category: 'STREAK', conditionType: 'STREAK', conditionValue: 14 },
  { id: 'a9', name: 'Inferno', description: '30-day streak', icon: '☄️', rarity: 'LEGENDARY', category: 'STREAK', conditionType: 'STREAK', conditionValue: 30 },

  // Category Mastery
  { id: 'a10', name: 'Code Ninja', description: 'Complete 50 LeetCode quests', icon: '🧠', rarity: 'RARE', category: 'MASTERY', conditionType: 'CATEGORY_LEETCODE', conditionValue: 50 },
  { id: 'a11', name: 'System Thinker', description: 'Complete 50 System Design quests', icon: '🏗️', rarity: 'RARE', category: 'MASTERY', conditionType: 'CATEGORY_SYSTEM_DESIGN', conditionValue: 50 },
  { id: 'a12', name: 'Domain Expert', description: 'Complete 50 Domain Study quests', icon: '📚', rarity: 'RARE', category: 'MASTERY', conditionType: 'CATEGORY_DOMAIN', conditionValue: 50 },
  { id: 'a13', name: 'Builder', description: 'Complete 50 Project quests', icon: '🚀', rarity: 'RARE', category: 'MASTERY', conditionType: 'CATEGORY_PROJECT', conditionValue: 50 },

  // Special
  { id: 'a14', name: 'Clean Sweep', description: 'Complete all 4 quests in one day', icon: '🧹', rarity: 'COMMON', category: 'SPECIAL', conditionType: 'DAILY_SWEEP', conditionValue: 1 },
  { id: 'a15', name: 'Sweep Streak', description: 'Clean sweep 7 days in a row', icon: '🌟', rarity: 'EPIC', category: 'SPECIAL', conditionType: 'DAILY_SWEEP', conditionValue: 7 },
  { id: 'a16', name: 'Big Spender', description: 'Spend 500 coins on rewards', icon: '💸', rarity: 'RARE', category: 'SPECIAL', conditionType: 'COINS_SPENT', conditionValue: 500 },
  { id: 'a17', name: 'Hard Mode', description: 'Complete 10 hard-difficulty quests', icon: '💪', rarity: 'RARE', category: 'SPECIAL', conditionType: 'HARD_QUESTS', conditionValue: 10 },
  { id: 'a18', name: 'Level 10', description: 'Reach Level 10', icon: '🎖️', rarity: 'RARE', category: 'SPECIAL', conditionType: 'LEVEL', conditionValue: 10 },

  // Couple
  { id: 'a19', name: 'Power Couple', description: 'Both complete all 4 quests on the same day', icon: '❤️', rarity: 'COMMON', category: 'COUPLE', conditionType: 'COUPLE_SWEEP', conditionValue: 1 },
  { id: 'a20', name: 'Soulmates', description: 'Both maintain 30-day streaks simultaneously', icon: '💕', rarity: 'LEGENDARY', category: 'COUPLE', conditionType: 'COUPLE_STREAK', conditionValue: 30 },
];
