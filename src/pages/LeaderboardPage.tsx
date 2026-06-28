import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import PlayerAvatar from '../components/shared/PlayerAvatar';
import { getWeekStart, getWeekNumber, todayStr } from '../utils/dateUtils';

export default function LeaderboardPage() {
  const { players, quests, playerAchievements, achievements, redemptions } = useGame();
  const p1 = players[0];
  const p2 = players[1];

  const weekStart = getWeekStart();
  const today = todayStr();
  const weekNum = getWeekNumber();

  const p1WeekQuests = quests.filter(q => q.playerId === 'player1' && q.completed && q.questDate >= weekStart && q.questDate <= today);
  const p2WeekQuests = quests.filter(q => q.playerId === 'player2' && q.completed && q.questDate >= weekStart && q.questDate <= today);
  const p1WeekXP = p1WeekQuests.reduce((s, q) => s + q.xpEarned, 0);
  const p2WeekXP = p2WeekQuests.reduce((s, q) => s + q.xpEarned, 0);

  const weekLeader = p1WeekQuests.length > p2WeekQuests.length ? p1 : p2WeekQuests.length > p1WeekQuests.length ? p2 : null;

  const stats: { label: string; p1: number | string; p2: number | string }[] = [
    { label: 'Total XP', p1: p1.xp.toLocaleString(), p2: p2.xp.toLocaleString() },
    { label: 'Level', p1: p1.level, p2: p2.level },
    { label: 'Current Streak', p1: p1.currentStreak, p2: p2.currentStreak },
    { label: 'Best Streak', p1: p1.longestStreak, p2: p2.longestStreak },
    { label: 'Coins', p1: p1.coins, p2: p2.coins },
    {
      label: 'LeetCode',
      p1: quests.filter(q => q.playerId === 'player1' && q.category === 'LEETCODE' && q.completed).length,
      p2: quests.filter(q => q.playerId === 'player2' && q.category === 'LEETCODE' && q.completed).length,
    },
    {
      label: 'Sys Design',
      p1: quests.filter(q => q.playerId === 'player1' && q.category === 'SYSTEM_DESIGN' && q.completed).length,
      p2: quests.filter(q => q.playerId === 'player2' && q.category === 'SYSTEM_DESIGN' && q.completed).length,
    },
    {
      label: 'Domain',
      p1: quests.filter(q => q.playerId === 'player1' && q.category === 'DOMAIN' && q.completed).length,
      p2: quests.filter(q => q.playerId === 'player2' && q.category === 'DOMAIN' && q.completed).length,
    },
    {
      label: 'Projects',
      p1: quests.filter(q => q.playerId === 'player1' && q.category === 'PROJECT' && q.completed).length,
      p2: quests.filter(q => q.playerId === 'player2' && q.category === 'PROJECT' && q.completed).length,
    },
    {
      label: 'Achievements',
      p1: `${playerAchievements.filter(pa => pa.playerId === 'player1' && pa.unlockedAt).length}/${achievements.length}`,
      p2: `${playerAchievements.filter(pa => pa.playerId === 'player2' && pa.unlockedAt).length}/${achievements.length}`,
    },
    {
      label: 'Rewards Used',
      p1: redemptions.filter(r => r.playerId === 'player1').length,
      p2: redemptions.filter(r => r.playerId === 'player2').length,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Leaderboard</h1>
        <span className="text-xs text-text-muted bg-bg-elevated px-2.5 py-1 rounded-full">Week {weekNum}</span>
      </div>

      {/* VS Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 glass-border">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-transparent to-love/15" />
        <div className="absolute inset-0 card-shine" />
        <div className="relative flex items-center justify-between">
          <motion.div
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="text-center flex-1"
          >
            <PlayerAvatar emoji={p1.avatarEmoji} level={p1.level} size="lg" showCrown isLeader={p1.xp > p2.xp} />
            <div className="text-sm font-bold mt-2">{p1.name}</div>
            <div className="text-2xl font-bold text-gradient-brand mt-1">{p1WeekQuests.length}</div>
            <div className="text-[10px] text-text-muted">quests · +{p1WeekXP} XP</div>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            className="text-4xl px-3 animate-float"
          >⚔️</motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="text-center flex-1"
          >
            <PlayerAvatar emoji={p2.avatarEmoji} level={p2.level} size="lg" showCrown isLeader={p2.xp > p1.xp} />
            <div className="text-sm font-bold mt-2">{p2.name}</div>
            <div className="text-2xl font-bold text-gradient-fire mt-1">{p2WeekQuests.length}</div>
            <div className="text-[10px] text-text-muted">quests · +{p2WeekXP} XP</div>
          </motion.div>
        </div>
        <div className="relative text-xs text-center mt-4 pt-3 border-t border-border">
          {weekLeader
            ? <span className="text-gradient-gold font-semibold">🔥 {weekLeader.name} leads by {Math.abs(p1WeekQuests.length - p2WeekQuests.length)} quests!</span>
            : (p1WeekQuests.length > 0 || p2WeekQuests.length > 0)
              ? <span className="text-text-muted">🤝 It's a tie this week!</span>
              : <span className="text-text-muted">🚀 Start competing!</span>}
        </div>
      </div>

      {/* Head-to-Head Stats */}
      <div className="bg-bg-card rounded-2xl glass-border overflow-hidden">
        <div className="p-3.5 border-b border-border">
          <div className="text-sm font-semibold flex items-center gap-2">
            <span className="w-1 h-4 bg-gradient-to-b from-primary to-love rounded-full" />
            Head-to-Head
          </div>
        </div>
        <div className="divide-y divide-border">
          {stats.map(row => {
            const p1Num = typeof row.p1 === 'number' ? row.p1 : parseInt(String(row.p1).replace(/,/g, ''));
            const p2Num = typeof row.p2 === 'number' ? row.p2 : parseInt(String(row.p2).replace(/,/g, ''));
            const p1Wins = !isNaN(p1Num) && !isNaN(p2Num) && p1Num > p2Num;
            const p2Wins = !isNaN(p1Num) && !isNaN(p2Num) && p2Num > p1Num;

            return (
              <div key={row.label} className="flex items-center px-3 py-2.5 text-xs">
                <span className={`w-12 text-right font-medium ${p1Wins ? 'text-primary-light' : 'text-text-secondary'}`}>
                  {p1Wins && '👑 '}{row.p1}
                </span>
                <span className="flex-1 text-center text-text-muted">{row.label}</span>
                <span className={`w-12 text-left font-medium ${p2Wins ? 'text-love' : 'text-text-secondary'}`}>
                  {row.p2}{p2Wins && ' 👑'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* All-Time Overall */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-bg-card rounded-2xl p-5 glass-border text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
        <div className="relative">
          <div className="text-sm font-semibold mb-3 flex items-center justify-center gap-2">
            <span className="w-1 h-4 bg-gradient-to-b from-gold to-fire-warm rounded-full" />
            Overall Leader
          </div>
          <div className="text-4xl mb-2 animate-float">{p1.xp > p2.xp ? p1.avatarEmoji : p2.xp > p1.xp ? p2.avatarEmoji : '🤝'}</div>
          <div className="text-sm font-bold text-gradient-brand">
            {p1.xp > p2.xp ? `${p1.name} leads by ${(p1.xp - p2.xp).toLocaleString()} XP` :
             p2.xp > p1.xp ? `${p2.name} leads by ${(p2.xp - p1.xp).toLocaleString()} XP` :
             "It's perfectly tied!"}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
