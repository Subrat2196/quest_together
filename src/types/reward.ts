import type { PlayerId } from './player';

export type RewardTier = 'SMALL' | 'MEDIUM' | 'PREMIUM';

export interface Reward {
  id: string;
  name: string;
  description: string;
  coinCost: number;
  tier: RewardTier;
  emoji: string;
  active: boolean;
  redeemedCount: number;
}

export interface Redemption {
  id: string;
  playerId: PlayerId;
  rewardId: string;
  rewardName: string;
  rewardEmoji: string;
  coinsSpent: number;
  redeemedAt: string;
}
