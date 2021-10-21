CREATE TABLE IF NOT EXISTS history (
  id SERIAL PRIMARY KEY,
  slack_id VARCHAR(100) NOT NULL UNIQUE,
  command VARCHAR(50) NOT NULL,

  timestamp TIMESTAMP WITH TIME ZONE,

  organization_slack_id VARCHAR(20),
  -- organization_slack_id VARCHAR(20) REFERENCES organization(slack_id) ON DELETE RESTRICT,
  organization_name VARCHAR(250),

  from_user_slack_id VARCHAR(20),
  -- from_user_slack_id VARCHAR(20) REFERENCES users(slack_id) ON DELETE RESTRICT,
  to_user_slack_id VARCHAR(20),
  -- to_user_slack_id VARCHAR(20) REFERENCES users(slack_id) ON DELETE RESTRICT,

  amount INTEGER DEFAULT 0,

  value INTEGER DEFAULT 0
);

