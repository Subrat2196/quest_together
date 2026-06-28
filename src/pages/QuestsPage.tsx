import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import StreakFlame from '../components/shared/StreakFlame';
import { QUEST_CATEGORIES, QUEST_CATEGORY_MAP, type QuestCategory, type Difficulty } from '../types/quest';
import type { Quest } from '../types/quest';
import { todayStr, formatDateTime, formatDate } from '../utils/dateUtils';
import { generateId } from '../utils/formatters';
import { XP_PER_DIFFICULTY, COINS_PER_DIFFICULTY } from '../utils/constants';
import type { ToastData } from '../components/shared/Toast';
import ToastContainer from '../components/shared/Toast';

const CATEGORY_BG: Record<QuestCategory, string> = {
  LEETCODE: 'border-l-quest-leetcode',
  SYSTEM_DESIGN: 'border-l-quest-sysdesign',
  DOMAIN: 'border-l-quest-domain',
  PROJECT: 'border-l-quest-project',
};

const CATEGORY_GLOW: Record<QuestCategory, string> = {
  LEETCODE: 'shadow-[0_0_25px_rgba(139,92,246,0.12)]',
  SYSTEM_DESIGN: 'shadow-[0_0_25px_rgba(59,130,246,0.12)]',
  DOMAIN: 'shadow-[0_0_25px_rgba(16,185,129,0.12)]',
  PROJECT: 'shadow-[0_0_25px_rgba(245,158,11,0.12)]',
};

export default function QuestsPage() {
  const {
    achievements, activePlayer, partner, todayQuests,
    addQuest, updateQuest: updateQuestApi, deleteQuest: deleteQuestApi, completeQuest: completeQuestApi,
  } = useGame();
  const today = todayStr();
  const myQuests = todayQuests(activePlayer.id);
  const partnerQuests = todayQuests(partner.id);
  const completedCount = myQuests.filter(q => q.completed).length;
  const totalXPToday = myQuests.filter(q => q.completed).reduce((s, q) => s + q.xpEarned, 0);

  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [editingQuest, setEditingQuest] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    setToasts(prev => [...prev, { ...toast, id: generateId() }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const createQuest = (category: QuestCategory, title: string, difficulty: Difficulty) => {
    const quest: Quest = {
      id: generateId(),
      playerId: activePlayer.id,
      questDate: today,
      category,
      title,
      description: '',
      difficulty,
      completed: false,
      completedAt: null,
      xpEarned: 0,
      coinsEarned: 0,
      notes: '',
      timeSpentMin: null,
    };
    addQuest(quest);
  };

  const handleCompleteQuest = async (questId: string) => {
    const result = await completeQuestApi(questId);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.65 }, colors: ['#7C3AED', '#10B981', '#F59E0B', '#EC4899'] });

    if (result) {
      addToast({
        icon: '⚡',
        title: `+${result.xpEarned} XP  +${result.coinsEarned} 🪙`,
        message: result.dailyBonusApplied ? '🎯 Daily sweep bonus! All 4 done!' : `${result.multiplier}x streak multiplier`,
        type: 'success',
      });
      if (result.levelUp) {
        setTimeout(() => {
          confetti({ particleCount: 200, spread: 120, origin: { y: 0.4 }, colors: ['#FCD34D', '#F59E0B', '#7C3AED'] });
          addToast({ icon: '🎉', title: `LEVEL UP! Level ${result.levelUp!.newLevel}`, message: `New title: "${result.levelUp!.newTitle}"`, type: 'levelup' });
        }, 600);
      }
      result.achievementsUnlocked?.forEach((id: string, i: number) => {
        const achievement = achievements.find(a => a.id === id);
        if (achievement) {
          setTimeout(() => addToast({ icon: achievement.icon, title: 'Achievement Unlocked!', message: achievement.name, type: 'achievement' }), 1200 + i * 600);
        }
      });
    }
  };

  const missingCategories = QUEST_CATEGORIES.filter(cat => !myQuests.some(q => q.category === cat.key));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Today's Quests</h1>
          <p className="text-xs text-text-muted mt-0.5">{formatDate(today)}</p>
        </div>
        <div className="flex items-center gap-3">
          {completedCount > 0 && (
            <span className="text-xs font-semibold text-gradient-gold">+{totalXPToday} XP</span>
          )}
          <StreakFlame days={activePlayer.currentStreak} size="md" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative bg-bg-card rounded-2xl p-3.5 glass-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-success/5 to-transparent" style={{ width: `${myQuests.length > 0 ? (completedCount / myQuests.length) * 100 : 0}%` }} />
        <div className="relative flex items-center justify-between mb-2">
          <span className="text-xs text-text-secondary font-medium">
            {completedCount === myQuests.length && myQuests.length === 4 ? '🎯 All quests complete!' : `${completedCount}/${myQuests.length || 0} completed`}
          </span>
          <div className="flex gap-1">
            {myQuests.map(q => (
              <div key={q.id} className={`w-2 h-2 rounded-full transition-all ${q.completed ? 'bg-success' : 'bg-bg-elevated'}`} />
            ))}
          </div>
        </div>
        <div className="relative w-full h-2 bg-bg-elevated rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-success to-success-light rounded-full"
            animate={{ width: `${myQuests.length > 0 ? (completedCount / myQuests.length) * 100 : 0}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Quest Cards */}
      <AnimatePresence mode="popLayout">
        {myQuests.map((quest, i) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            index={i}
            isEditing={editingQuest === quest.id}
            onEdit={() => setEditingQuest(editingQuest === quest.id ? null : quest.id)}
            onComplete={() => handleCompleteQuest(quest.id)}
            onUpdate={(updates) => updateQuestApi(quest.id, updates)}
            onDelete={() => deleteQuestApi(quest.id)}
          />
        ))}
      </AnimatePresence>

      {/* Add Quest */}
      {missingCategories.length > 0 && (
        <div className="space-y-2">
          {!showAddForm ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowAddForm(true)}
              className="w-full py-3.5 rounded-2xl border-2 border-dashed border-border text-text-muted text-sm hover:border-primary/50 hover:text-primary-light transition-all duration-300"
            >
              + Add Quest ({missingCategories.length} remaining)
            </motion.button>
          ) : (
            <AddQuestForm categories={missingCategories} onCreate={createQuest} onClose={() => setShowAddForm(false)} />
          )}
        </div>
      )}

      {/* Quick Add All */}
      {myQuests.length === 0 && (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => QUEST_CATEGORIES.forEach(cat => createQuest(cat.key, `${cat.label} Session`, 'MEDIUM'))}
          className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-semibold text-sm transition-all btn-press glow-primary"
        >
          ⚡ Create All 4 Quests
        </motion.button>
      )}

      {/* Partner Status */}
      <div className="bg-bg-card/60 rounded-2xl p-3.5 glass-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-base">
            {partner.avatarEmoji}
          </div>
          <div className="flex-1">
            <div className="text-xs text-text-secondary font-medium">{partner.name}'s progress</div>
            <div className="flex items-center gap-1.5 mt-1">
              {QUEST_CATEGORIES.map(cat => {
                const pq = partnerQuests.find(q => q.category === cat.key);
                return <div key={cat.key} className={`w-2 h-2 rounded-full ${pq?.completed ? 'bg-success' : 'bg-bg-elevated'}`} />;
              })}
              <span className="text-[10px] text-text-muted ml-1">
                {partnerQuests.filter(q => q.completed).length}/{partnerQuests.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function QuestCard({
  quest, index, isEditing, onEdit, onComplete, onUpdate, onDelete,
}: {
  quest: Quest; index: number; isEditing: boolean;
  onEdit: () => void; onComplete: () => void;
  onUpdate: (u: Partial<Quest>) => void; onDelete: () => void;
}) {
  const cat = QUEST_CATEGORY_MAP[quest.category];
  const [notes, setNotes] = useState(quest.notes);
  const stars: Record<Difficulty, number> = { EASY: 1, MEDIUM: 2, HARD: 3 };
  const diffLabel: Record<Difficulty, string> = { EASY: 'Easy', MEDIUM: 'Medium', HARD: 'Hard' };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`rounded-2xl border-l-4 glass-border card-shine transition-all duration-300 ${CATEGORY_BG[quest.category]} ${
        quest.completed ? `glow-success bg-bg-card` : `bg-bg-card hover:${CATEGORY_GLOW[quest.category]}`
      }`}
    >
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between mb-1.5">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
              quest.completed ? 'bg-success/15' : 'bg-bg-elevated'
            }`}>
              {quest.completed ? '✅' : cat.emoji}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-text-muted font-semibold">{cat.label}</div>
              <div className="text-sm font-semibold text-text-primary mt-0.5">{quest.title}</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 3 }, (_, i) => (
                <span key={i} className={`text-xs ${i < stars[quest.difficulty] ? 'text-gold' : 'text-border'}`}>★</span>
              ))}
            </div>
            <span className="text-[9px] text-text-muted">{diffLabel[quest.difficulty]}</span>
          </div>
        </div>

        {/* Reward preview */}
        {!quest.completed && (
          <div className="flex items-center gap-3 text-xs text-text-muted mt-2 mb-3 ml-[46px]">
            <span className="text-gradient-gold font-medium">+{XP_PER_DIFFICULTY[quest.difficulty]} XP</span>
            <span className="text-gold/70">+{COINS_PER_DIFFICULTY[quest.difficulty]} 🪙</span>
          </div>
        )}

        {/* Completed details */}
        {quest.completed && quest.completedAt && (
          <div className="ml-[46px] mt-1.5">
            <div className="text-xs text-success/80">
              ✓ Completed at {formatDateTime(quest.completedAt)}
            </div>
            <div className="flex gap-3 text-xs mt-1">
              <span className="text-gradient-gold font-medium">+{quest.xpEarned} XP</span>
              <span className="text-gold/70">+{quest.coinsEarned} 🪙</span>
            </div>
            {quest.notes && (
              <div className="mt-2 text-xs text-text-secondary bg-bg-elevated/60 rounded-lg px-3 py-2 border border-border">
                📝 {quest.notes}
              </div>
            )}
          </div>
        )}

        {/* Actions for pending */}
        {!quest.completed && (
          <div className="mt-3 space-y-2.5 ml-[46px]">
            <input
              type="text"
              placeholder="What did you work on? (optional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              onBlur={() => onUpdate({ notes })}
              className="w-full bg-bg-input border border-border rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-primary/50 transition-colors"
            />
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onComplete}
                className="flex-1 bg-gradient-to-r from-success to-success-light text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
              >
                ✅ Complete
              </motion.button>
              <button onClick={onEdit} className="w-10 h-10 bg-bg-elevated hover:bg-bg-input rounded-xl text-text-muted text-sm transition-colors flex items-center justify-center">✏️</button>
              <button onClick={onDelete} className="w-10 h-10 bg-bg-elevated hover:bg-fire/10 rounded-xl text-text-muted text-sm transition-colors flex items-center justify-center">🗑️</button>
            </div>
          </div>
        )}

        {/* Edit form */}
        <AnimatePresence>
          {isEditing && !quest.completed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden ml-[46px]"
            >
              <div className="pt-3 mt-3 border-t border-border space-y-2">
                <input
                  type="text"
                  value={quest.title}
                  onChange={e => onUpdate({ title: e.target.value })}
                  className="w-full bg-bg-input border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary/50"
                />
                <div className="flex gap-2">
                  {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map(d => (
                    <button
                      key={d}
                      onClick={() => onUpdate({ difficulty: d })}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                        quest.difficulty === d ? 'bg-primary text-white glow-primary' : 'bg-bg-elevated text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function AddQuestForm({
  categories, onCreate, onClose,
}: {
  categories: typeof QUEST_CATEGORIES;
  onCreate: (cat: QuestCategory, title: string, diff: Difficulty) => void;
  onClose: () => void;
}) {
  const [selectedCat, setSelectedCat] = useState<QuestCategory>(categories[0].key);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const cat = QUEST_CATEGORY_MAP[selectedCat];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-card rounded-2xl p-4 glass-border space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Add Quest</span>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-bg-elevated flex items-center justify-center text-text-muted hover:text-text-primary text-xs">✕</button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button
            key={c.key}
            onClick={() => { setSelectedCat(c.key); setTitle(`${c.label} Session`); }}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedCat === c.key ? 'bg-primary text-white glow-primary' : 'bg-bg-elevated text-text-muted hover:bg-bg-input'
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>
      <input
        type="text" placeholder={`e.g., ${cat.label} Session`} value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full bg-bg-input border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-primary/50"
      />
      <div className="flex gap-2">
        {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map(d => (
          <button key={d} onClick={() => setDifficulty(d)} className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${difficulty === d ? 'bg-primary text-white' : 'bg-bg-elevated text-text-muted'}`}>{d}</button>
        ))}
      </div>
      <button
        onClick={() => { onCreate(selectedCat, title || `${cat.label} Session`, difficulty); onClose(); }}
        className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-3 rounded-xl transition-all btn-press"
      >
        Add Quest
      </button>
    </motion.div>
  );
}
