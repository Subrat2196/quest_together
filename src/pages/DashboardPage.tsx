import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import PlayerAvatar from '../components/shared/PlayerAvatar';
import XPProgressBar from '../components/shared/XPProgressBar';
import CoinCounter from '../components/shared/CoinCounter';
import StreakFlame from '../components/shared/StreakFlame';
import LevelBadge from '../components/shared/LevelBadge';
import { QUEST_CATEGORY_MAP } from '../types/quest';
import { getWeekStart, todayStr } from '../utils/dateUtils';
import { MOTIVATIONAL_MESSAGES } from '../utils/constants';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } },
};

export default function DashboardPage() {
  const { players, quests, achievements, playerAchievements, activePlayer, partner, todayQuests } = useGame();
  const p1 = players[0];
  const p2 = players[1];

  const myQuests = todayQuests(activePlayer.id);
  const partnerQuests = todayQuests(partner.id);
  const partnerCompleted = partnerQuests.filter(q => q.completed).length;

  const message = useMemo(() =>
    MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
  , []);

  const weekStart = getWeekStart();
  const today = todayStr();
  const p1WeekQuests = quests.filter(q => q.playerId === 'player1' && q.completed && q.questDate >= weekStart && q.questDate <= today).length;
  const p2WeekQuests = quests.filter(q => q.playerId === 'player2' && q.completed && q.questDate >= weekStart && q.questDate <= today).length;
  const maxWeek = Math.max(p1WeekQuests, p2WeekQuests, 1);

  const recentAchievements = playerAchievements
    .filter(pa => pa.playerId === activePlayer.id && pa.unlockedAt)
    .sort((a, b) => (b.unlockedAt ?? '').localeCompare(a.unlockedAt ?? ''))
    .slice(0, 3)
    .map(pa => achievements.find(a => a.id === pa.achievementId)!)
    .filter(Boolean);

  return (
    <motion.div className="space-y-5" variants={stagger.container} initial="hidden" animate="show">

      {/* Motivational Banner */}
      <motion.div
        variants={stagger.item}
        className="relative overflow-hidden rounded-2xl p-4 glass glass-border"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-love/10" />
        <p className="relative text-sm text-center text-text-primary font-medium">
          ✨ {message}
        </p>
      </motion.div>

      {/* Player Cards */}
      <motion.div variants={stagger.item} className="grid grid-cols-2 gap-3">
        {[p1, p2].map(player => {
          const isActive = player.id === activePlayer.id;
          const pQuests = todayQuests(player.id);
          const pCompleted = pQuests.filter(q => q.completed).length;
          const isLeader = player.xp > (player.id === p1.id ? p2.xp : p1.xp);

          return (
            <motion.div
              key={player.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative overflow-hidden rounded-2xl p-3.5 glass-border card-shine transition-all duration-300 ${
                isActive
                  ? 'bg-bg-card glow-primary'
                  : 'bg-bg-card/60'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-love to-primary" />
              )}
              <div className="flex items-center gap-2 mb-3">
                <PlayerAvatar emoji={player.avatarEmoji} level={player.level} size="sm" showCrown isLeader={isLeader} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">{player.name}</div>
                  <div className="text-[10px] text-text-muted flex items-center gap-1">
                    <LevelBadge level={player.level} size="sm" />
                    <span>{player.title}</span>
                  </div>
                </div>
              </div>
              <XPProgressBar totalXP={player.xp} size="sm" showLabel={false} />
              <div className="flex items-center justify-between mt-2.5">
                <CoinCounter amount={player.coins} size="sm" />
                <StreakFlame days={player.currentStreak} size="sm" />
              </div>
              <div className="mt-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-text-muted">Today</span>
                  <span className="text-[10px] font-medium text-text-secondary">{pCompleted}/{pQuests.length || 4}</span>
                </div>
                <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-success to-success-light rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pQuests.length > 0 ? (pCompleted / pQuests.length) * 100 : 0}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Today's Progress */}
      <motion.div variants={stagger.item} className="bg-bg-card rounded-2xl p-4 glass-border card-shine">
        <div className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-gradient-to-b from-primary to-love rounded-full" />
          Today's Progress
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {(['LEETCODE', 'SYSTEM_DESIGN', 'DOMAIN', 'PROJECT'] as const).map(cat => {
            const quest = myQuests.find(q => q.category === cat);
            const info = QUEST_CATEGORY_MAP[cat];
            const done = quest?.completed;
            return (
              <motion.div
                key={cat}
                whileHover={{ scale: 1.05 }}
                className={`text-center py-2.5 rounded-xl transition-all ${
                  done
                    ? 'bg-success/10 border border-success/20'
                    : 'bg-bg-elevated/50 border border-transparent'
                }`}
              >
                <div className={`text-2xl mb-1 ${done ? '' : 'opacity-30 grayscale'}`}>
                  {done ? '✅' : info.emoji}
                </div>
                <div className={`text-[10px] truncate px-1 ${done ? 'text-success' : 'text-text-muted'}`}>
                  {info.label}
                </div>
              </motion.div>
            );
          })}
        </div>
        <Link
          to="/quests"
          className="block w-full text-center bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 btn-press glow-primary"
        >
          ⚔️ Go to Today's Quests
        </Link>
      </motion.div>

      {/* Weekly Race */}
      <motion.div variants={stagger.item} className="bg-bg-card rounded-2xl p-4 glass-border card-shine">
        <div className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-gradient-to-b from-gold to-fire-warm rounded-full" />
          This Week's Race
        </div>
        {[{ player: p1, count: p1WeekQuests, color: 'from-primary to-primary-light' },
          { player: p2, count: p2WeekQuests, color: 'from-love to-love-light' }].map(({ player, count, color }) => (
          <div key={player.id} className="flex items-center gap-2.5 mb-2.5">
            <span className="text-xs w-16 truncate text-text-secondary font-medium">{player.name}</span>
            <div className="flex-1 h-4 bg-bg-elevated rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${(count / maxWeek) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            <span className="text-xs text-text-primary font-bold w-6 text-right">{count}</span>
          </div>
        ))}
        <div className="text-xs text-center text-text-muted mt-2 pt-2 border-t border-border">
          {p1WeekQuests !== p2WeekQuests
            ? `🏆 ${p1WeekQuests > p2WeekQuests ? p1.name : p2.name} leads by ${Math.abs(p1WeekQuests - p2WeekQuests)}!`
            : p1WeekQuests > 0 ? '🤝 It\'s a tie!' : '🚀 Start your week strong!'}
        </div>
      </motion.div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <motion.div variants={stagger.item} className="bg-bg-card rounded-2xl p-4 glass-border card-shine">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-quest-leetcode to-quest-sysdesign rounded-full" />
              Recent Achievements
            </div>
            <Link to="/achievements" className="text-xs text-primary-light hover:text-primary transition-colors">
              View all →
            </Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {recentAchievements.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                className="flex-shrink-0 bg-bg-elevated/80 rounded-xl p-3 text-center min-w-[85px] border border-border hover:border-primary/30 transition-colors"
              >
                <div className="text-2xl mb-1.5 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>{a.icon}</div>
                <div className="text-[10px] text-text-secondary font-medium">{a.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Partner Status */}
      <motion.div
        variants={stagger.item}
        className="bg-bg-card/60 rounded-2xl p-3.5 glass-border flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center text-lg">
          {partner.avatarEmoji}
        </div>
        <div className="flex-1">
          <div className="text-xs text-text-secondary font-medium">
            {partner.name}'s progress today
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {(['LEETCODE', 'SYSTEM_DESIGN', 'DOMAIN', 'PROJECT'] as const).map(cat => {
              const pq = partnerQuests.find(q => q.category === cat);
              return (
                <div key={cat} className={`w-2 h-2 rounded-full ${pq?.completed ? 'bg-success' : 'bg-bg-elevated'}`} />
              );
            })}
            <span className="text-[10px] text-text-muted ml-1">{partnerCompleted}/{partnerQuests.length || 0}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
