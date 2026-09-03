-- =============================================================
-- Migration: fix users/withdrawals/payments schema mismatch
-- Run this in Cloudflare D1 Console (Query box), one statement
-- at a time or all together — order matters, don't skip steps.
-- =============================================================

-- 1) Create new users table with correct schema (TEXT id = uuid)
CREATE TABLE users_new (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2) Migrate only real accounts (must have email + password_hash)
INSERT INTO users_new (id, name, email, password_hash, balance, created_at)
SELECT lower(hex(randomblob(16))), name, email, password_hash, CAST(balance AS INTEGER), created_at
FROM users WHERE email IS NOT NULL AND password_hash IS NOT NULL;

-- 3) Swap old users table for the new one
DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

-- 4) Rebuild withdrawals and payments with correct schema
-- (both were empty, so nothing is lost)
DROP TABLE withdrawals;
DROP TABLE payments;

CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  currency TEXT NOT NULL,
  amount INTEGER NOT NULL,
  authority TEXT,
  ref_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE withdrawals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  method TEXT NOT NULL,
  address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 5) Sanity check — should show your migrated user(s), 0 payments, 0 withdrawals
SELECT * FROM users;
SELECT * FROM payments;
SELECT * FROM withdrawals;


