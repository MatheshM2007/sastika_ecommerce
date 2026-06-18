#!/bin/bash
# Run this script to migrate the database schema (add banners table etc.)

echo "Running database migration..."

# Add banners table if not exists
psql "$DATABASE_URL" <<'SQL'
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL DEFAULT '',
  subtitle VARCHAR(300) NOT NULL DEFAULT '',
  image_url TEXT,
  link_url VARCHAR(300) NOT NULL DEFAULT '/products',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active);
SQL

if [ $? -eq 0 ]; then
  echo "Migration completed successfully!"
else
  echo "Migration failed. Check your DATABASE_URL."
  exit 1
fi