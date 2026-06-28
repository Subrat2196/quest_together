import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import QuestsPage from './pages/QuestsPage';
import RewardShopPage from './pages/RewardShopPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AchievementsPage from './pages/AchievementsPage';
import ProfilePage from './pages/ProfilePage';
import StatisticsPage from './pages/StatisticsPage';

export default function App() {
  return (
    <Router>
      <GameProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/quests" element={<QuestsPage />} />
            <Route path="/shop" element={<RewardShopPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
          </Route>
        </Routes>
      </GameProvider>
    </Router>
  );
}
