import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const NAV_ITEMS = [
  { to: '/', icon: '🏠', activeIcon: '🏠', label: 'Home' },
  { to: '/quests', icon: '⚔️', activeIcon: '⚔️', label: 'Quests' },
  { to: '/shop', icon: '🛒', activeIcon: '🛒', label: 'Shop' },
  { to: '/leaderboard', icon: '🏆', activeIcon: '🏆', label: 'Board' },
  { to: '/profile', icon: '👤', activeIcon: '👤', label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass glass-border border-t-0">
      <div className="max-w-lg mx-auto flex px-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className="flex-1 relative"
          >
            {({ isActive }) => (
              <div
                className={clsx(
                  'flex flex-col items-center py-2 gap-0.5 transition-all duration-200',
                  isActive ? 'text-primary-light' : 'text-text-muted'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-px left-3 right-3 h-0.5 bg-gradient-to-r from-primary to-love rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <motion.span
                  className="text-lg"
                  animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {isActive ? item.activeIcon : item.icon}
                </motion.span>
                <span className={clsx(
                  'text-[10px] font-medium transition-colors',
                  isActive ? 'text-primary-light' : 'text-text-muted'
                )}>
                  {item.label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
