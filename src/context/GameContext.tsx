import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '../services/supabase';
import type { Player, PlayerId } from '../types/player';
import type { Quest, QuestCompletionResult } from '../types/quest';
import type { Reward, Redemption } from '../types/reward';
import type { Achievement, PlayerAchievement } from '../types/achievement';
import { calculateXP, calculateCoins, calculateLevelInfo } from '../utils/xpCalculator';
import { todayStr, isConsecutiveDay, isSameDay } from '../utils/dateUtils';
import { generateId } from '../utils/formatters';

interface GameContextType {
  players: Player[];
  quests: Quest[];
  rewards: Reward[];
  redemptions: Redemption[];
  achievements: Achievement[];
  playerAchievements: PlayerAchievement[];
  activePlayerId: PlayerId;
  lastCompletionResult: QuestCompletionResult | null;
  loading: boolean;

  activePlayer: Player;
  partner: Player;

  setActivePlayer: (id: PlayerId) => void;
  updatePlayer: (id: PlayerId, updates: Partial<Player>) => Promise<void>;
  addQuest: (quest: Quest) => Promise<void>;
  updateQuest: (id: string, updates: Partial<Quest>) => Promise<void>;
  deleteQuest: (id: string) => Promise<void>;
  completeQuest: (id: string) => Promise<QuestCompletionResult | null>;
  addReward: (reward: Reward) => Promise<void>;
  redeemReward: (rewardId: string, playerId: PlayerId) => Promise<boolean>;
  todayQuests: (playerId: PlayerId) => Quest[];
  getAchievementProgress: (playerId: PlayerId, achievement: Achievement) => number;
  clearCompletionResult: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

// DB row → app type mappers
function rowToPlayer(r: Record<string, unknown>): Player {
  return {
    id: r.id as PlayerId, name: r.name as string, avatarEmoji: r.avatar_emoji as string,
    xp: Number(r.xp), coins: Number(r.coins), level: Number(r.level), title: r.title as string,
    currentStreak: Number(r.current_streak), longestStreak: Number(r.longest_streak),
    lastQuestDate: r.last_quest_date as string | null, joinedDate: r.joined_date as string,
    totalCoinsEarned: Number(r.total_coins_earned), totalCoinsSpent: Number(r.total_coins_spent),
  };
}

function rowToQuest(r: Record<string, unknown>): Quest {
  return {
    id: r.id as string, playerId: r.player_id as PlayerId, questDate: r.quest_date as string,
    category: r.category as Quest['category'], title: r.title as string, description: r.description as string,
    difficulty: r.difficulty as Quest['difficulty'], completed: r.completed as boolean,
    completedAt: r.completed_at as string | null, xpEarned: Number(r.xp_earned), coinsEarned: Number(r.coins_earned),
    notes: r.notes as string, timeSpentMin: r.time_spent_min as number | null,
  };
}

function rowToReward(r: Record<string, unknown>): Reward {
  return {
    id: r.id as string, name: r.name as string, description: r.description as string,
    coinCost: Number(r.coin_cost), tier: r.tier as Reward['tier'], emoji: r.emoji as string,
    active: r.active as boolean, redeemedCount: Number(r.redeemed_count),
  };
}

function rowToRedemption(r: Record<string, unknown>): Redemption {
  return {
    id: r.id as string, playerId: r.player_id as PlayerId, rewardId: r.reward_id as string,
    rewardName: r.reward_name as string, rewardEmoji: r.reward_emoji as string,
    coinsSpent: Number(r.coins_spent), redeemedAt: r.redeemed_at as string,
  };
}

function rowToAchievement(r: Record<string, unknown>): Achievement {
  return {
    id: r.id as string, name: r.name as string, description: r.description as string,
    icon: r.icon as string, rarity: r.rarity as Achievement['rarity'],
    category: r.category as Achievement['category'],
    conditionType: r.condition_type as string, conditionValue: Number(r.condition_value),
  };
}

function rowToPlayerAchievement(r: Record<string, unknown>): PlayerAchievement {
  return {
    achievementId: r.achievement_id as string, playerId: r.player_id as PlayerId,
    currentValue: Number(r.current_value), unlockedAt: r.unlocked_at as string | null,
  };
}

function calcProgress(playerId: PlayerId, achievement: Achievement, players: Player[], quests: Quest[]): number {
  const player = players.find(p => p.id === playerId)!;
  const pq = quests.filter(q => q.playerId === playerId && q.completed);
  switch (achievement.conditionType) {
    case 'TOTAL_QUESTS': return pq.length;
    case 'STREAK': return player.currentStreak;
    case 'CATEGORY_LEETCODE': return pq.filter(q => q.category === 'LEETCODE').length;
    case 'CATEGORY_SYSTEM_DESIGN': return pq.filter(q => q.category === 'SYSTEM_DESIGN').length;
    case 'CATEGORY_DOMAIN': return pq.filter(q => q.category === 'DOMAIN').length;
    case 'CATEGORY_PROJECT': return pq.filter(q => q.category === 'PROJECT').length;
    case 'DAILY_SWEEP': {
      const m = new Map<string, number>();
      pq.forEach(q => m.set(q.questDate, (m.get(q.questDate) || 0) + 1));
      return [...m.values()].filter(c => c >= 4).length;
    }
    case 'COINS_SPENT': return player.totalCoinsSpent;
    case 'HARD_QUESTS': return pq.filter(q => q.difficulty === 'HARD').length;
    case 'LEVEL': return player.level;
    case 'COUPLE_STREAK': {
      const p1 = players.find(p => p.id === 'player1')!;
      const p2 = players.find(p => p.id === 'player2')!;
      return Math.min(p1.currentStreak, p2.currentStreak);
    }
    default: return 0;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [playerAchievements, setPlayerAchievements] = useState<PlayerAchievement[]>([]);
  const [activePlayerId, setActivePlayerId] = useState<PlayerId>('player1');
  const [lastCompletionResult, setLastCompletionResult] = useState<QuestCompletionResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial data load
  useEffect(() => {
    async function load() {
      const [pRes, qRes, rRes, rdRes, aRes, paRes] = await Promise.all([
        supabase.from('players').select('*'),
        supabase.from('quests').select('*').order('created_at', { ascending: false }),
        supabase.from('rewards').select('*').order('coin_cost'),
        supabase.from('redemptions').select('*').order('redeemed_at', { ascending: false }),
        supabase.from('achievements').select('*'),
        supabase.from('player_achievements').select('*'),
      ]);
      if (pRes.data) setPlayers(pRes.data.map(rowToPlayer));
      if (qRes.data) setQuests(qRes.data.map(rowToQuest));
      if (rRes.data) setRewards(rRes.data.map(rowToReward));
      if (rdRes.data) setRedemptions(rdRes.data.map(rowToRedemption));
      if (aRes.data) setAchievements(aRes.data.map(rowToAchievement));
      if (paRes.data) setPlayerAchievements(paRes.data.map(rowToPlayerAchievement));
      setLoading(false);
    }
    load();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    const channel = supabase.channel('game-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, payload => {
        if (payload.eventType === 'UPDATE' && payload.new) {
          setPlayers(prev => prev.map(p => p.id === payload.new.id ? rowToPlayer(payload.new) : p));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quests' }, payload => {
        if (payload.eventType === 'INSERT' && payload.new) {
          setQuests(prev => {
            if (prev.some(q => q.id === payload.new.id)) return prev;
            return [rowToQuest(payload.new), ...prev];
          });
        } else if (payload.eventType === 'UPDATE' && payload.new) {
          setQuests(prev => prev.map(q => q.id === payload.new.id ? rowToQuest(payload.new) : q));
        } else if (payload.eventType === 'DELETE' && payload.old) {
          setQuests(prev => prev.filter(q => q.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'redemptions' }, payload => {
        if (payload.new) {
          setRedemptions(prev => {
            if (prev.some(r => r.id === payload.new.id)) return prev;
            return [rowToRedemption(payload.new), ...prev];
          });
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'player_achievements' }, payload => {
        if (payload.new) {
          setPlayerAchievements(prev => {
            if (prev.some(pa => pa.achievementId === payload.new.achievement_id && pa.playerId === payload.new.player_id)) return prev;
            return [...prev, rowToPlayerAchievement(payload.new)];
          });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const activePlayer = players.find(p => p.id === activePlayerId) || players[0];
  const partner = players.find(p => p.id !== activePlayerId) || players[1];

  const todayQuestsFn = useCallback((playerId: PlayerId) => {
    const today = todayStr();
    return quests.filter(q => q.playerId === playerId && q.questDate === today);
  }, [quests]);

  const updatePlayer = useCallback(async (id: PlayerId, updates: Partial<Player>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.avatarEmoji !== undefined) dbUpdates.avatar_emoji = updates.avatarEmoji;
    if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
    if (updates.coins !== undefined) dbUpdates.coins = updates.coins;
    if (updates.level !== undefined) dbUpdates.level = updates.level;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.currentStreak !== undefined) dbUpdates.current_streak = updates.currentStreak;
    if (updates.longestStreak !== undefined) dbUpdates.longest_streak = updates.longestStreak;
    if (updates.lastQuestDate !== undefined) dbUpdates.last_quest_date = updates.lastQuestDate;
    if (updates.totalCoinsEarned !== undefined) dbUpdates.total_coins_earned = updates.totalCoinsEarned;
    if (updates.totalCoinsSpent !== undefined) dbUpdates.total_coins_spent = updates.totalCoinsSpent;
    dbUpdates.updated_at = new Date().toISOString();

    await supabase.from('players').update(dbUpdates).eq('id', id);
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const addQuest = useCallback(async (quest: Quest) => {
    await supabase.from('quests').insert({
      id: quest.id, player_id: quest.playerId, quest_date: quest.questDate,
      category: quest.category, title: quest.title, description: quest.description,
      difficulty: quest.difficulty, completed: false, xp_earned: 0, coins_earned: 0,
      notes: quest.notes, time_spent_min: quest.timeSpentMin,
    });
    setQuests(prev => [quest, ...prev]);
  }, []);

  const updateQuest = useCallback(async (id: string, updates: Partial<Quest>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.difficulty !== undefined) dbUpdates.difficulty = updates.difficulty;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    await supabase.from('quests').update(dbUpdates).eq('id', id);
    setQuests(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  }, []);

  const deleteQuest = useCallback(async (id: string) => {
    await supabase.from('quests').delete().eq('id', id);
    setQuests(prev => prev.filter(q => q.id !== id));
  }, []);

  const completeQuest = useCallback(async (questId: string): Promise<QuestCompletionResult | null> => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return null;

    const player = players.find(p => p.id === quest.playerId)!;
    const today = quest.questDate;

    // Streak
    let newStreak = player.currentStreak;
    if (!player.lastQuestDate) newStreak = 1;
    else if (isSameDay(player.lastQuestDate, today)) { /* same day */ }
    else if (isConsecutiveDay(player.lastQuestDate, today)) newStreak = player.currentStreak + 1;
    else newStreak = 1;
    const isNewRecord = newStreak > player.longestStreak;

    // All daily complete?
    const todayQ = quests.filter(q => q.playerId === quest.playerId && q.questDate === today);
    const completedCount = todayQ.filter(q => q.completed).length;
    const allDailyComplete = completedCount + 1 === 4 && todayQ.length === 4;

    // XP & Coins
    const xpEarned = calculateXP(quest.difficulty, newStreak, new Date(today), allDailyComplete);
    const coinsEarned = calculateCoins(quest.difficulty, allDailyComplete);

    const newTotalXP = player.xp + xpEarned;
    const levelInfo = calculateLevelInfo(newTotalXP);
    const leveledUp = levelInfo.level > player.level;

    // Update quest in DB
    const now = new Date().toISOString();
    await supabase.from('quests').update({
      completed: true, completed_at: now, xp_earned: xpEarned, coins_earned: coinsEarned,
    }).eq('id', questId);

    setQuests(prev => prev.map(q => q.id === questId ? {
      ...q, completed: true, completedAt: now, xpEarned, coinsEarned,
    } : q));

    // Update player in DB
    const playerUpdates = {
      xp: newTotalXP, coins: player.coins + coinsEarned,
      level: levelInfo.level, title: levelInfo.title,
      currentStreak: newStreak, longestStreak: Math.max(newStreak, player.longestStreak),
      lastQuestDate: today, totalCoinsEarned: player.totalCoinsEarned + coinsEarned,
    };
    await updatePlayer(quest.playerId, playerUpdates);

    // Check achievements
    const updatedPlayers = players.map(p => p.id === quest.playerId ? { ...p, ...playerUpdates } : p);
    const updatedQuests = quests.map(q => q.id === questId ? { ...q, completed: true, completedAt: now, xpEarned, coinsEarned } : q);
    const unlockedIds = new Set(playerAchievements.filter(pa => pa.playerId === quest.playerId && pa.unlockedAt).map(pa => pa.achievementId));
    const newlyUnlocked: string[] = [];

    for (const a of achievements) {
      if (unlockedIds.has(a.id)) continue;
      const progress = calcProgress(quest.playerId, a, updatedPlayers, updatedQuests);
      if (progress >= a.conditionValue) {
        newlyUnlocked.push(a.id);
        await supabase.from('player_achievements').insert({
          player_id: quest.playerId, achievement_id: a.id, current_value: progress, unlocked_at: now,
        });
      }
    }
    if (newlyUnlocked.length > 0) {
      setPlayerAchievements(prev => [
        ...prev,
        ...newlyUnlocked.map(aid => ({ achievementId: aid, playerId: quest.playerId, currentValue: 0, unlockedAt: now })),
      ]);
    }

    const streakMult = newStreak >= 30 ? 2.0 : newStreak >= 14 ? 1.75 : newStreak >= 7 ? 1.5 : newStreak >= 3 ? 1.25 : 1.0;
    const result: QuestCompletionResult = {
      xpEarned, coinsEarned,
      streakUpdate: { current: newStreak, isNewRecord },
      levelUp: leveledUp ? { occurred: true, newLevel: levelInfo.level, newTitle: levelInfo.title } : null,
      achievementsUnlocked: newlyUnlocked,
      dailyBonusApplied: allDailyComplete,
      multiplier: streakMult,
    };
    setLastCompletionResult(result);
    return result;
  }, [quests, players, achievements, playerAchievements, updatePlayer]);

  const addReward = useCallback(async (reward: Reward) => {
    await supabase.from('rewards').insert({
      id: reward.id, name: reward.name, description: reward.description,
      coin_cost: reward.coinCost, tier: reward.tier, emoji: reward.emoji,
      active: reward.active, redeemed_count: 0,
    });
    setRewards(prev => [...prev, reward]);
  }, []);

  const redeemReward = useCallback(async (rewardId: string, playerId: PlayerId): Promise<boolean> => {
    const reward = rewards.find(r => r.id === rewardId);
    const player = players.find(p => p.id === playerId);
    if (!reward || !player || player.coins < reward.coinCost) return false;

    const redemption: Redemption = {
      id: generateId(), playerId, rewardId: reward.id,
      rewardName: reward.name, rewardEmoji: reward.emoji,
      coinsSpent: reward.coinCost, redeemedAt: new Date().toISOString(),
    };

    await supabase.from('redemptions').insert({
      id: redemption.id, player_id: playerId, reward_id: rewardId,
      reward_name: reward.name, reward_emoji: reward.emoji,
      coins_spent: reward.coinCost, redeemed_at: redemption.redeemedAt,
    });

    await supabase.from('rewards').update({ redeemed_count: reward.redeemedCount + 1 }).eq('id', rewardId);

    await updatePlayer(playerId, {
      coins: player.coins - reward.coinCost,
      totalCoinsSpent: player.totalCoinsSpent + reward.coinCost,
    });

    setRedemptions(prev => [redemption, ...prev]);
    setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, redeemedCount: r.redeemedCount + 1 } : r));
    return true;
  }, [rewards, players, updatePlayer]);

  const getAchievementProgressFn = useCallback((playerId: PlayerId, achievement: Achievement) =>
    calcProgress(playerId, achievement, players, quests),
  [players, quests]);

  if (loading || players.length === 0) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-bg-base">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-float">🔥</div>
          <div className="text-sm text-text-muted">Loading Quest Together...</div>
        </div>
      </div>
    );
  }

  return (
    <GameContext.Provider value={{
      players, quests, rewards, redemptions, achievements, playerAchievements,
      activePlayerId, lastCompletionResult, loading,
      activePlayer: activePlayer!, partner: partner!,
      setActivePlayer: setActivePlayerId,
      updatePlayer, addQuest, updateQuest, deleteQuest, completeQuest,
      addReward, redeemReward, todayQuests: todayQuestsFn,
      getAchievementProgress: getAchievementProgressFn,
      clearCompletionResult: () => setLastCompletionResult(null),
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
