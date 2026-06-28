-- ============================================================
-- Quest Together - Database Setup
-- Run this ENTIRE script in Supabase SQL Editor (Dashboard → SQL Editor → New Query → Paste → Run)
-- ============================================================

-- Players
CREATE TABLE players (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL DEFAULT 'Player',
    avatar_emoji    TEXT NOT NULL DEFAULT '🧑‍💻',
    xp              BIGINT NOT NULL DEFAULT 0,
    coins           INTEGER NOT NULL DEFAULT 0,
    level           INTEGER NOT NULL DEFAULT 1,
    title           TEXT NOT NULL DEFAULT 'Novice Coder',
    current_streak  INTEGER NOT NULL DEFAULT 0,
    longest_streak  INTEGER NOT NULL DEFAULT 0,
    last_quest_date TEXT,
    joined_date     TEXT NOT NULL,
    total_coins_earned INTEGER NOT NULL DEFAULT 0,
    total_coins_spent  INTEGER NOT NULL DEFAULT 0,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Daily Quests
CREATE TABLE quests (
    id              TEXT PRIMARY KEY,
    player_id       TEXT NOT NULL REFERENCES players(id),
    quest_date      TEXT NOT NULL,
    category        TEXT NOT NULL,
    title           TEXT NOT NULL,
    description     TEXT NOT NULL DEFAULT '',
    difficulty      TEXT NOT NULL DEFAULT 'MEDIUM',
    completed       BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at    TEXT,
    xp_earned       INTEGER NOT NULL DEFAULT 0,
    coins_earned    INTEGER NOT NULL DEFAULT 0,
    notes           TEXT NOT NULL DEFAULT '',
    time_spent_min  INTEGER,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quests_player_date ON quests(player_id, quest_date);

-- Rewards (shop catalog)
CREATE TABLE rewards (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    description     TEXT NOT NULL DEFAULT '',
    coin_cost       INTEGER NOT NULL CHECK (coin_cost > 0),
    tier            TEXT NOT NULL,
    emoji           TEXT NOT NULL DEFAULT '🎁',
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    redeemed_count  INTEGER NOT NULL DEFAULT 0
);

-- Redemptions
CREATE TABLE redemptions (
    id              TEXT PRIMARY KEY,
    player_id       TEXT NOT NULL REFERENCES players(id),
    reward_id       TEXT NOT NULL REFERENCES rewards(id),
    reward_name     TEXT NOT NULL,
    reward_emoji    TEXT NOT NULL DEFAULT '🎁',
    coins_spent     INTEGER NOT NULL,
    redeemed_at     TEXT NOT NULL
);

-- Achievements (definitions)
CREATE TABLE achievements (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    description     TEXT NOT NULL,
    icon            TEXT NOT NULL DEFAULT '🏆',
    rarity          TEXT NOT NULL DEFAULT 'COMMON',
    category        TEXT NOT NULL,
    condition_type  TEXT NOT NULL,
    condition_value INTEGER NOT NULL
);

-- Player Achievements
CREATE TABLE player_achievements (
    id              BIGSERIAL PRIMARY KEY,
    player_id       TEXT NOT NULL REFERENCES players(id),
    achievement_id  TEXT NOT NULL REFERENCES achievements(id),
    current_value   INTEGER NOT NULL DEFAULT 0,
    unlocked_at     TEXT,
    CONSTRAINT uq_player_achievement UNIQUE (player_id, achievement_id)
);

-- ============================================================
-- Enable Row Level Security (allow all for anon - it's a private 2-player game)
-- ============================================================
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for players" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for quests" ON quests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for rewards" ON rewards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for redemptions" ON redemptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for achievements" ON achievements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for player_achievements" ON player_achievements FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- Enable Realtime for live sync between phones
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE quests;
ALTER PUBLICATION supabase_realtime ADD TABLE redemptions;
ALTER PUBLICATION supabase_realtime ADD TABLE player_achievements;

-- ============================================================
-- Seed: 2 Players
-- ============================================================
INSERT INTO players (id, name, avatar_emoji, joined_date) VALUES
('player1', 'Player 1', '🧑‍💻', TO_CHAR(NOW(), 'YYYY-MM-DD')),
('player2', 'Player 2', '👩‍💻', TO_CHAR(NOW(), 'YYYY-MM-DD'));

-- ============================================================
-- Seed: Achievements
-- ============================================================
INSERT INTO achievements (id, name, description, icon, rarity, category, condition_type, condition_value) VALUES
('a1', 'First Steps', 'Complete your first quest', '👣', 'COMMON', 'MILESTONE', 'TOTAL_QUESTS', 1),
('a2', 'Getting Warmed Up', 'Complete 25 quests', '⭐', 'COMMON', 'MILESTONE', 'TOTAL_QUESTS', 25),
('a3', 'Half Century', 'Complete 50 quests', '🥈', 'RARE', 'MILESTONE', 'TOTAL_QUESTS', 50),
('a4', 'Century Club', 'Complete 100 quests', '💯', 'EPIC', 'MILESTONE', 'TOTAL_QUESTS', 100),
('a5', 'Quest Machine', 'Complete 200 quests', '🤖', 'LEGENDARY', 'MILESTONE', 'TOTAL_QUESTS', 200),
('a6', 'Spark', '3-day streak', '✨', 'COMMON', 'STREAK', 'STREAK', 3),
('a7', 'On Fire', '7-day streak', '🔥', 'RARE', 'STREAK', 'STREAK', 7),
('a8', 'Blazing', '14-day streak', '🌋', 'EPIC', 'STREAK', 'STREAK', 14),
('a9', 'Inferno', '30-day streak', '☄️', 'LEGENDARY', 'STREAK', 'STREAK', 30),
('a10', 'Code Ninja', 'Complete 50 LeetCode quests', '🧠', 'RARE', 'MASTERY', 'CATEGORY_LEETCODE', 50),
('a11', 'System Thinker', 'Complete 50 System Design quests', '🏗️', 'RARE', 'MASTERY', 'CATEGORY_SYSTEM_DESIGN', 50),
('a12', 'Domain Expert', 'Complete 50 Domain Study quests', '📚', 'RARE', 'MASTERY', 'CATEGORY_DOMAIN', 50),
('a13', 'Builder', 'Complete 50 Project quests', '🚀', 'RARE', 'MASTERY', 'CATEGORY_PROJECT', 50),
('a14', 'Clean Sweep', 'Complete all 4 quests in one day', '🧹', 'COMMON', 'SPECIAL', 'DAILY_SWEEP', 1),
('a15', 'Sweep Streak', 'Clean sweep 7 days in a row', '🌟', 'EPIC', 'SPECIAL', 'DAILY_SWEEP', 7),
('a16', 'Big Spender', 'Spend 500 coins on rewards', '💸', 'RARE', 'SPECIAL', 'COINS_SPENT', 500),
('a17', 'Hard Mode', 'Complete 10 hard-difficulty quests', '💪', 'RARE', 'SPECIAL', 'HARD_QUESTS', 10),
('a18', 'Level 10', 'Reach Level 10', '🎖️', 'RARE', 'SPECIAL', 'LEVEL', 10),
('a19', 'Power Couple', 'Both complete all 4 quests on the same day', '❤️', 'COMMON', 'COUPLE', 'COUPLE_SWEEP', 1),
('a20', 'Soulmates', 'Both maintain 30-day streaks simultaneously', '💕', 'LEGENDARY', 'COUPLE', 'COUPLE_STREAK', 30);

-- ============================================================
-- Seed: Rewards
-- ============================================================
INSERT INTO rewards (id, name, description, coin_cost, tier, emoji) VALUES
('r1', 'Chai Date', 'Tapri chai together', 25, 'SMALL', '🍵'),
('r2', 'Favorite Chocolate', 'Pick any chocolate bar', 30, 'SMALL', '🍫'),
('r3', 'Evening Walk + Kulfi', 'Walk and kulfi stop', 35, 'SMALL', '🍦'),
('r4', 'Favorite Snack', 'Any snack from the store', 35, 'SMALL', '🍿'),
('r5', 'TV Episode', 'Watch 1 episode together guilt-free', 40, 'SMALL', '📺'),
('r6', 'PS5 Session', '30-minute PS5 session', 40, 'SMALL', '🎮'),
('r7', 'Board Game Time', 'Play one board game together', 40, 'SMALL', '🎲'),
('r8', 'Popcorn + Short Movie', 'Make popcorn, pick a short movie', 45, 'SMALL', '🍿'),
('r9', 'Bubble Tea', 'Order your favorite bubble tea', 50, 'SMALL', '🧋'),
('r10', 'Ice Cream', 'Corner House or Naturals', 50, 'SMALL', '🍨'),
('r11', 'Coffee Date', 'Third Wave or Blue Tokai', 60, 'SMALL', '☕'),
('r12', 'Dessert Outing', 'Aubree or favorite bakery', 60, 'SMALL', '🍰'),
('r13', 'Street Food Order', 'Order favorite street food', 55, 'SMALL', '🥘'),
('r14', 'Breakfast in Bed', 'Partner makes breakfast in bed', 70, 'SMALL', '🥞'),
('r15', 'Sleep-in Pass', 'One guilt-free sleep in, no alarm', 80, 'SMALL', '😴'),
('r16', 'Movie Night', 'PVR + popcorn combo', 100, 'MEDIUM', '🎬'),
('r17', 'Cafe Hopping', 'Visit 2 cafes in one trip', 120, 'MEDIUM', '☕'),
('r18', 'Brunch Date', 'Nice brunch spot', 120, 'MEDIUM', '🥂'),
('r19', 'Dinner Date', 'Mid-range restaurant', 150, 'MEDIUM', '🍽️'),
('r20', 'New Book', 'Buy any book you want', 100, 'MEDIUM', '📖'),
('r21', 'New Restaurant', 'Try somewhere completely new', 150, 'MEDIUM', '🍜'),
('r22', 'Bowling', 'Bowling alley date', 150, 'MEDIUM', '🎳'),
('r23', 'Mini Shopping', 'Small shopping trip', 180, 'MEDIUM', '🛍️'),
('r24', 'Bake Together', 'Pick a recipe, bake it together', 100, 'MEDIUM', '🧁'),
('r25', 'Long Drive + Chai', 'Drive to the outskirts, find a chai stop', 120, 'MEDIUM', '🚗'),
('r26', 'Picnic', 'Cubbon Park picnic', 100, 'MEDIUM', '🧺'),
('r27', 'Arcade Date', 'Timezone or Smaaash', 150, 'MEDIUM', '🕹️'),
('r28', 'Karaoke Night', 'Sing your hearts out', 150, 'MEDIUM', '🎤'),
('r29', 'Sunset Point + Chai', 'Catch the sunset together', 100, 'MEDIUM', '🌅'),
('r30', 'Cloud Kitchen Order', 'Order from a fancy cloud kitchen', 130, 'MEDIUM', '🍕'),
('r31', 'Shopping Budget', 'INR 3000 shopping spree', 400, 'PREMIUM', '🛒'),
('r32', 'Spa Day', 'Book a spa appointment', 350, 'PREMIUM', '💆'),
('r33', 'Weekend Resort', 'Resort near Bangalore', 800, 'PREMIUM', '🏖️'),
('r34', 'One-Day Trip', 'Nandi Hills or Mysore', 500, 'PREMIUM', '🗺️'),
('r35', 'LEGO Set', 'Pick any LEGO set', 400, 'PREMIUM', '🧱'),
('r36', 'Fancy Dinner', 'Fine dining experience', 400, 'PREMIUM', '🥩'),
('r37', 'Couple Massage', 'Book a couple massage', 350, 'PREMIUM', '💆‍♂️'),
('r38', 'Theme Park', 'Wonderla adventure', 450, 'PREMIUM', '🎢'),
('r39', 'Concert', 'Live show or concert', 500, 'PREMIUM', '🎵'),
('r40', 'Trek', 'Skandagiri or Savandurga', 350, 'PREMIUM', '🥾'),
('r41', 'Staycation', 'One night city hotel', 600, 'PREMIUM', '🏨'),
('r42', 'Gadget Fund', 'INR 3-5K toward a gadget', 500, 'PREMIUM', '📱'),
('r43', 'PS5 Game', 'Buy a new PS5 game', 400, 'PREMIUM', '🎮'),
('r44', 'Board Game', 'Buy a premium board game', 300, 'PREMIUM', '♟️'),
('r45', 'Escape Room', 'Escape room experience', 350, 'PREMIUM', '🔐'),
('r46', 'Cooking Class', 'Take a cooking class together', 400, 'PREMIUM', '👨‍🍳'),
('r47', 'Pottery Class', 'Pottery or art class date', 350, 'PREMIUM', '🏺'),
('r48', 'Go-Karting', 'Go-karting race date', 350, 'PREMIUM', '🏎️');
