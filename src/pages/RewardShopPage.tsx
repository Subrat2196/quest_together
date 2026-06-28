import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import CoinCounter from '../components/shared/CoinCounter';
import type { RewardTier, Reward } from '../types/reward';
import { formatDateShort } from '../utils/dateUtils';
import { generateId } from '../utils/formatters';

const TIERS: { key: RewardTier; label: string; emoji: string; range: string }[] = [
  { key: 'SMALL', label: 'Small', emoji: '🎁', range: '25-80' },
  { key: 'MEDIUM', label: 'Medium', emoji: '🎯', range: '100-250' },
  { key: 'PREMIUM', label: 'Premium', emoji: '💎', range: '300+' },
];

export default function RewardShopPage() {
  const { rewards, redemptions, players, activePlayer, addReward, redeemReward } = useGame();
  const [activeTier, setActiveTier] = useState<RewardTier>('SMALL');
  const [confirmingReward, setConfirmingReward] = useState<Reward | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredRewards = rewards.filter(r => r.tier === activeTier && r.active);
  const recentRedemptions = [...redemptions]
    .sort((a, b) => b.redeemedAt.localeCompare(a.redeemedAt))
    .slice(0, 5);

  const handleRedeem = (reward: Reward) => {
    redeemReward(reward.id, activePlayer.id);
    setConfirmingReward(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Reward Shop</h1>
          <p className="text-xs text-text-muted mt-0.5">Earn coins. Redeem real rewards.</p>
        </div>
        <CoinCounter amount={activePlayer.coins} size="md" />
      </div>

      {/* Tier Tabs */}
      <div className="flex gap-2">
        {TIERS.map(tier => (
          <motion.button
            key={tier.key}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTier(tier.key)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
              activeTier === tier.key
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white glow-primary'
                : 'bg-bg-card text-text-muted glass-border hover:bg-bg-elevated'
            }`}
          >
            {tier.emoji} {tier.label}
            <span className="block text-[10px] opacity-60 mt-0.5">{tier.range} coins</span>
          </motion.button>
        ))}
      </div>

      {/* Reward Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredRewards.map((reward, i) => {
          const canAfford = activePlayer.coins >= reward.coinCost;
          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-bg-card rounded-2xl p-3.5 glass-border card-shine transition-all duration-300 ${
                canAfford ? 'hover:glow-gold' : 'opacity-60'
              }`}
            >
              <div className="text-3xl text-center mb-2 animate-float" style={{ animationDelay: `${i * 0.3}s` }}>{reward.emoji}</div>
              <div className="text-sm font-semibold text-center text-text-primary mb-0.5">{reward.name}</div>
              <div className="text-[10px] text-text-muted text-center mb-2 line-clamp-2">{reward.description}</div>
              <div className="text-xs text-center mb-2.5 font-bold text-gradient-gold">🪙 {reward.coinCost}</div>
              <button
                onClick={() => canAfford && setConfirmingReward(reward)}
                disabled={!canAfford}
                className={`w-full py-2 rounded-xl text-xs font-semibold transition-all btn-press ${
                  canAfford
                    ? 'bg-gradient-to-r from-success to-success-light text-white'
                    : 'bg-bg-elevated text-text-muted cursor-not-allowed'
                }`}
              >
                {canAfford ? 'Redeem ✓' : `Need ${reward.coinCost - activePlayer.coins} more`}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Add Custom Reward */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full py-2.5 rounded-xl border-2 border-dashed border-border text-text-muted text-sm hover:border-primary hover:text-primary-light transition-colors"
      >
        + Add Custom Reward
      </button>

      {showAddForm && (
        <AddRewardForm
          onAdd={(reward) => {
            addReward(reward);
            setShowAddForm(false);
          }}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* Recent Redemptions */}
      {recentRedemptions.length > 0 && (
        <div className="bg-bg-card rounded-xl p-4 border border-border">
          <div className="text-sm font-semibold mb-3">Recent Redemptions</div>
          {recentRedemptions.map(r => {
            const player = players.find(p => p.id === r.playerId);
            return (
              <div key={r.id} className="flex items-center gap-2 py-1.5 text-xs text-text-secondary">
                <span>{formatDateShort(r.redeemedAt)}</span>
                <span>-</span>
                <span>{player?.name}</span>
                <span className="text-text-primary">"{r.rewardName}" {r.rewardEmoji}</span>
                <span className="ml-auto text-gold">-{r.coinsSpent}🪙</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmingReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmingReward(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-bg-card rounded-2xl p-6 border border-border max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-5xl text-center mb-4">{confirmingReward.emoji}</div>
              <div className="text-lg font-bold text-center mb-1">{confirmingReward.name}</div>
              <div className="text-sm text-text-muted text-center mb-4">{confirmingReward.description}</div>
              <div className="text-center text-gold text-lg font-bold mb-6">🪙 {confirmingReward.coinCost} coins</div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmingReward(null)}
                  className="flex-1 py-2.5 bg-bg-elevated rounded-xl text-text-secondary text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRedeem(confirmingReward)}
                  className="flex-1 py-2.5 bg-success hover:bg-success-light rounded-xl text-white text-sm font-medium active:scale-95 transition-all"
                >
                  Redeem! 🎉
                </button>
              </div>
              <div className="text-xs text-text-muted text-center mt-3">
                Balance after: 🪙 {activePlayer.coins - confirmingReward.coinCost}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddRewardForm({ onAdd, onClose }: { onAdd: (r: Reward) => void; onClose: () => void }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [cost, setCost] = useState(50);
  const [emoji, setEmoji] = useState('🎁');
  const [tier, setTier] = useState<RewardTier>('SMALL');

  return (
    <div className="bg-bg-card rounded-xl p-4 border border-primary/30 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Add Custom Reward</span>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary text-sm">✕</button>
      </div>
      <div className="flex gap-2">
        <input value={emoji} onChange={e => setEmoji(e.target.value)} className="w-12 bg-bg-input border border-border rounded-lg px-2 py-2 text-center text-xl focus:outline-none focus:border-primary" maxLength={4} />
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Reward name" className="flex-1 bg-bg-input border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary" />
      </div>
      <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className="w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary" />
      <div className="flex gap-2 items-center">
        <span className="text-xs text-text-muted">Cost:</span>
        <input type="number" value={cost} onChange={e => setCost(Number(e.target.value))} min={1} className="w-20 bg-bg-input border border-border rounded-lg px-2 py-1.5 text-sm text-gold text-center focus:outline-none focus:border-primary" />
        <span className="text-xs text-gold">🪙</span>
        <div className="flex-1 flex gap-1 ml-2">
          {(['SMALL', 'MEDIUM', 'PREMIUM'] as RewardTier[]).map(t => (
            <button key={t} onClick={() => setTier(t)} className={`flex-1 py-1 rounded text-[10px] ${tier === t ? 'bg-primary text-white' : 'bg-bg-elevated text-text-muted'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => {
          if (!name) return;
          onAdd({ id: generateId(), name, description: desc, coinCost: cost, tier, emoji, active: true, redeemedCount: 0 });
        }}
        className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        Add Reward
      </button>
    </div>
  );
}
