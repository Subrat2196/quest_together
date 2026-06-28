import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import PlayerAvatar from '../components/shared/PlayerAvatar';
import XPProgressBar from '../components/shared/XPProgressBar';
import StatCard from '../components/shared/StatCard';
import ProgressBar from '../components/shared/ProgressBar';
import { QUEST_CATEGORIES } from '../types/quest';
import { formatDateShort } from '../utils/dateUtils';
export default function ProfilePage() {
  const { quests, playerAchievements, achievements, redemptions, activePlayer, updatePlayer } = useGame();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(activePlayer.name);
  const [emoji, setEmoji] = useState(activePlayer.avatarEmoji);
  const completedQuests = quests.filter(q => q.playerId === activePlayer.id && q.completed);
  const unlockedCount = playerAchievements.filter(pa => pa.playerId === activePlayer.id && pa.unlockedAt).length;
  const redeemCount = redemptions.filter(r => r.playerId === activePlayer.id).length;

  const categoryStats = QUEST_CATEGORIES.map(cat => ({
    ...cat,
    count: completedQuests.filter(q => q.category === cat.key).length,
  }));
  const maxCat = Math.max(...categoryStats.map(c => c.count), 1);

  const coinHistory = [
    ...completedQuests.map(q => ({
      date: q.completedAt!,
      amount: q.coinsEarned,
      label: `${QUEST_CATEGORIES.find(c => c.key === q.category)?.label} quest`,
      type: 'earn' as const,
    })),
    ...redemptions
      .filter(r => r.playerId === activePlayer.id)
      .map(r => ({
        date: r.redeemedAt,
        amount: -r.coinsSpent,
        label: `Redeemed: ${r.rewardName}`,
        type: 'spend' as const,
      })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);

  const saveName = () => {
    updatePlayer(activePlayer.id, { name, avatarEmoji: emoji });
    setEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="bg-bg-card rounded-xl p-5 border border-border text-center">
        {editing ? (
          <div className="space-y-3">
            <input value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={4} className="text-4xl bg-transparent text-center w-16 mx-auto block focus:outline-none" />
            <input value={name} onChange={e => setName(e.target.value)} className="bg-bg-input border border-border rounded-lg px-3 py-2 text-center text-sm w-48 mx-auto block text-text-primary focus:outline-none focus:border-primary" />
            <div className="flex gap-2 justify-center">
              <button onClick={() => setEditing(false)} className="px-4 py-1.5 bg-bg-elevated rounded-lg text-xs text-text-muted">Cancel</button>
              <button onClick={saveName} className="px-4 py-1.5 bg-primary rounded-lg text-xs text-white">Save</button>
            </div>
          </div>
        ) : (
          <>
            <PlayerAvatar emoji={activePlayer.avatarEmoji} level={activePlayer.level} size="lg" />
            <div className="text-lg font-bold mt-3">{activePlayer.name}</div>
            <div className="text-sm text-gold">👑 Level {activePlayer.level}</div>
            <div className="text-xs text-text-muted mb-3">"{activePlayer.title}"</div>
            <XPProgressBar totalXP={activePlayer.xp} size="md" />
            <button onClick={() => setEditing(true)} className="mt-3 text-xs text-primary-light hover:underline">
              Edit Profile
            </button>
          </>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard icon="🪙" value={activePlayer.coins.toLocaleString()} label="Coins" />
        <StatCard icon="🔥" value={activePlayer.currentStreak} label="Streak" />
        <StatCard icon="✅" value={completedQuests.length} label="Quests" />
        <StatCard icon="🏆" value={`${unlockedCount}/${achievements.length}`} label="Badges" />
        <StatCard icon="🎁" value={redeemCount} label="Redeemed" />
        <StatCard icon="📅" value={formatDateShort(activePlayer.joinedDate)} label="Joined" />
      </div>

      {/* Quest Breakdown */}
      <div className="bg-bg-card rounded-xl p-4 border border-border">
        <div className="text-sm font-semibold mb-3">Quest Breakdown</div>
        {categoryStats.map(cat => (
          <div key={cat.key} className="flex items-center gap-2 mb-2">
            <span className="text-sm w-5">{cat.emoji}</span>
            <span className="text-xs w-20 text-text-secondary">{cat.label}</span>
            <div className="flex-1">
              <ProgressBar
                value={cat.count}
                max={maxCat}
                color={`bg-quest-${cat.key === 'LEETCODE' ? 'leetcode' : cat.key === 'SYSTEM_DESIGN' ? 'sysdesign' : cat.key === 'DOMAIN' ? 'domain' : 'project'}`}
                height="sm"
              />
            </div>
            <span className="text-xs text-text-muted w-6 text-right">{cat.count}</span>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="flex gap-2">
        <Link to="/achievements" className="flex-1 bg-bg-card rounded-xl p-3 border border-border text-center text-xs text-text-secondary hover:border-primary/50 transition-colors">
          🏆 Achievements
        </Link>
        <Link to="/statistics" className="flex-1 bg-bg-card rounded-xl p-3 border border-border text-center text-xs text-text-secondary hover:border-primary/50 transition-colors">
          📊 Statistics
        </Link>
      </div>

      {/* Coin History */}
      {coinHistory.length > 0 && (
        <div className="bg-bg-card rounded-xl p-4 border border-border">
          <div className="text-sm font-semibold mb-3">Coin History</div>
          {coinHistory.map((entry, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-text-muted w-12">{formatDateShort(entry.date)}</span>
                <span className="text-text-secondary">{entry.label}</span>
              </div>
              <span className={entry.type === 'earn' ? 'text-success' : 'text-fire'}>
                {entry.type === 'earn' ? '+' : ''}{entry.amount} 🪙
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Reset Data (debug) */}
      <button
        onClick={() => {
          if (confirm('This will reset ALL game data. Are you sure?')) {
            localStorage.removeItem('quest-together-state');
            window.location.reload();
          }
        }}
        className="w-full py-2 text-xs text-text-muted hover:text-fire transition-colors"
      >
        Reset Game Data
      </button>
    </div>
  );
}
