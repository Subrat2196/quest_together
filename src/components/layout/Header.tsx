import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import CoinCounter from '../shared/CoinCounter';
import StreakFlame from '../shared/StreakFlame';
import PlayerAvatar from '../shared/PlayerAvatar';

export default function Header() {
  const { activePlayerId, activePlayer, partner, setActivePlayer } = useGame();
  const location = useLocation();

  const switchPlayer = () => {
    setActivePlayer(activePlayerId === 'player1' ? 'player2' : 'player1');
  };

  const pageTitle: Record<string, string> = {
    '/': '',
    '/quests': 'Quests',
    '/shop': 'Reward Shop',
    '/leaderboard': 'Leaderboard',
    '/achievements': 'Achievements',
    '/profile': 'Profile',
    '/statistics': 'Statistics',
  };
  const title = pageTitle[location.pathname] || '';

  return (
    <header className="sticky top-0 z-40 glass glass-border">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo - always links home */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.span
            className="text-xl"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          >
            🔥
          </motion.span>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-gradient-brand leading-tight tracking-tight">
              Quest Together
            </span>
            {title && (
              <span className="text-[10px] text-text-muted leading-tight">{title}</span>
            )}
          </div>
        </Link>

        {/* Right side: streak, coins, avatar */}
        <div className="flex items-center gap-2.5">
          <StreakFlame days={activePlayer.currentStreak} size="sm" />
          <div className="w-px h-5 bg-border" />
          <CoinCounter amount={activePlayer.coins} size="sm" />
          <div className="w-px h-5 bg-border" />
          <button
            onClick={switchPlayer}
            className="relative group btn-press"
            title={`Switch to ${partner.name}`}
          >
            <PlayerAvatar
              emoji={activePlayer.avatarEmoji}
              level={activePlayer.level}
              size="sm"
              isLeader={activePlayer.xp > partner.xp}
              showCrown
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-bg-elevated border border-border text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              🔄
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
