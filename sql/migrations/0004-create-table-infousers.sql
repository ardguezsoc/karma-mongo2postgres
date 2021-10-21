CREATE TABLE IF NOT EXISTS infousers (
  id SERIAL PRIMARY KEY,
  slack_id VARCHAR(20) NOT NULL UNIQUE,
  organization VARCHAR(20) REFERENCES organization(slack_id) ON DELETE RESTRICT,
  name VARCHAR(250) NOT NULL,
  first_name VARCHAR(250),
  last_name VARCHAR(250),
  real_name VARCHAR(250),
  real_name_normalized VARCHAR(250),
  display_name VARCHAR(250),
  display_name_normalized VARCHAR(250),
  image VARCHAR(250),
  color VARCHAR(6)
);
