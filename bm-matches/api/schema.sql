-- Database schema for BM Matches application
-- Run this in Vercel Postgres SQL editor after creating the database

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id VARCHAR(255) PRIMARY KEY,
  match_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(match_date)
);

-- Player availability table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS player_availability (
  id VARCHAR(255) PRIMARY KEY,
  match_id VARCHAR(255) NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id VARCHAR(255) NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('IN', 'OUT', NULL)),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(match_id, player_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_availability_match ON player_availability(match_id);
CREATE INDEX IF NOT EXISTS idx_availability_player ON player_availability(player_id);
CREATE INDEX IF NOT EXISTS idx_players_created ON players(created_at);
