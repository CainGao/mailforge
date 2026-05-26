-- MailForge 用户体系数据库初始化脚本
-- 在 Supabase SQL Editor 中执行

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  avatar TEXT DEFAULT '',
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  plan_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 使用记录表（按天统计）
CREATE TABLE IF NOT EXISTS usage (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  date DATE NOT NULL,
  count INTEGER DEFAULT 0,
  UNIQUE(email, date)
);

-- 3. 索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_usage_email_date ON usage(email, date);

-- 4. RLS（Row Level Security）- 暂时关闭，用 service_key 访问
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

-- 允许 service_role 完全访问
CREATE POLICY "Service role full access on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on usage" ON usage
  FOR ALL USING (true) WITH CHECK (true);
