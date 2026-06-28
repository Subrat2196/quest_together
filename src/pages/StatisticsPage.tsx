import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useGame } from '../context/GameContext';
import { QUEST_CATEGORIES } from '../types/quest';
import type { PlayerId } from '../types/player';
import { format, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, subDays } from 'date-fns';

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

export default function StatisticsPage() {
  const { players, quests } = useGame();
  const [viewPlayer, setViewPlayer] = useState<PlayerId | 'both'>('both');
  const p1 = players[0];
  const p2 = players[1];

  const filteredQuests = useMemo(() =>
    quests.filter(q => q.completed && (viewPlayer === 'both' || q.playerId === viewPlayer)),
    [quests, viewPlayer]
  );

  // Weekly data (last 4 weeks)
  const weeklyData = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const ws = startOfWeek(subWeeks(new Date(), 3 - i), { weekStartsOn: 1 });
      const we = endOfWeek(ws, { weekStartsOn: 1 });
      const wsStr = format(ws, 'yyyy-MM-dd');
      const weStr = format(we, 'yyyy-MM-dd');
      const weekQuests = filteredQuests.filter(q => q.questDate >= wsStr && q.questDate <= weStr);
      return {
        week: `Wk ${format(ws, 'w')}`,
        quests: weekQuests.length,
        xp: weekQuests.reduce((s, q) => s + q.xpEarned, 0),
      };
    });
  }, [filteredQuests]);

  // Category breakdown
  const categoryData = useMemo(() =>
    QUEST_CATEGORIES.map((cat, i) => ({
      name: cat.label,
      value: filteredQuests.filter(q => q.category === cat.key).length,
      color: COLORS[i],
      emoji: cat.emoji,
    })),
    [filteredQuests]
  );
  const totalCategoryQuests = categoryData.reduce((s, c) => s + c.value, 0);

  // Heatmap (last 28 days)
  const heatmapData = useMemo(() => {
    const days = eachDayOfInterval({ start: subDays(new Date(), 27), end: new Date() });
    return days.map(d => {
      const dateStr = format(d, 'yyyy-MM-dd');
      const count = filteredQuests.filter(q => q.questDate === dateStr).length;
      return { date: d, dateStr, count, dayLabel: format(d, 'EEE') };
    });
  }, [filteredQuests]);

  // Averages
  const activeDays = new Set(filteredQuests.map(q => q.questDate)).size;
  const avgDaily = activeDays > 0 ? Math.round(filteredQuests.reduce((s, q) => s + q.xpEarned, 0) / activeDays) : 0;
  const bestDay = filteredQuests.reduce((best, q) => {
    const existing = best.get(q.questDate) || 0;
    best.set(q.questDate, existing + q.xpEarned);
    return best;
  }, new Map<string, number>());
  const bestDayEntry = [...bestDay.entries()].sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Statistics</h1>
        <div className="flex gap-1 bg-bg-card rounded-lg p-0.5 border border-border">
          {[
            { key: 'player1' as PlayerId, label: p1.name },
            { key: 'both' as const, label: 'Both' },
            { key: 'player2' as PlayerId, label: p2.name },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setViewPlayer(opt.key)}
              className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${
                viewPlayer === opt.key ? 'bg-primary text-white' : 'text-text-muted'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-bg-card rounded-xl p-4 border border-border">
        <div className="text-sm font-semibold mb-3">Weekly Quests (Last 4 Weeks)</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyData}>
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{ background: '#1A1A2E', border: '1px solid #2D2D4A', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#F1F5F9' }}
            />
            <Bar dataKey="quests" fill="#7C3AED" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap */}
      <div className="bg-bg-card rounded-xl p-4 border border-border">
        <div className="text-sm font-semibold mb-3">Daily Completion (Last 28 Days)</div>
        <div className="grid grid-cols-7 gap-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="text-[9px] text-text-muted text-center">{d}</div>
          ))}
          {heatmapData.map(d => {
            const intensity = d.count >= 4 ? 'bg-success' : d.count >= 3 ? 'bg-success/70' : d.count >= 2 ? 'bg-success/40' : d.count >= 1 ? 'bg-success/20' : 'bg-bg-elevated';
            return (
              <div
                key={d.dateStr}
                className={`aspect-square rounded-sm ${intensity} transition-colors`}
                title={`${format(d.date, 'MMM d')}: ${d.count} quests`}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-2 text-[9px] text-text-muted justify-end">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map(n => (
            <div key={n} className={`w-3 h-3 rounded-sm ${n >= 4 ? 'bg-success' : n >= 3 ? 'bg-success/70' : n >= 2 ? 'bg-success/40' : n >= 1 ? 'bg-success/20' : 'bg-bg-elevated'}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-bg-card rounded-xl p-4 border border-border">
        <div className="text-sm font-semibold mb-3">Category Breakdown</div>
        <div className="flex items-center gap-4">
          <div className="w-28 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={25} outerRadius={45} dataKey="value" stroke="none">
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1.5">
            {categoryData.map(cat => (
              <div key={cat.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                <span className="text-text-secondary">{cat.emoji} {cat.name}</span>
                <span className="ml-auto text-text-muted">{cat.value} ({totalCategoryQuests > 0 ? Math.round((cat.value / totalCategoryQuests) * 100) : 0}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Averages */}
      <div className="bg-bg-card rounded-xl p-4 border border-border">
        <div className="text-sm font-semibold mb-3">Averages</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-xl font-bold text-gold">{avgDaily}</div>
            <div className="text-[10px] text-text-muted">Avg Daily XP</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-success">{filteredQuests.length}</div>
            <div className="text-[10px] text-text-muted">Total Quests</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary-light">{activeDays}</div>
            <div className="text-[10px] text-text-muted">Active Days</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-fire">{bestDayEntry ? bestDayEntry[1] : 0}</div>
            <div className="text-[10px] text-text-muted">
              Best Day {bestDayEntry ? `(${format(parseISO(bestDayEntry[0]), 'MMM d')})` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
