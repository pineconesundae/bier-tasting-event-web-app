CREATE TABLE signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attendee_name TEXT NOT NULL CHECK (length(attendee_name) BETWEEN 1 AND 80),
  brewery TEXT NOT NULL CHECK (length(brewery) BETWEEN 1 AND 100),
  beer_name TEXT NOT NULL CHECK (length(beer_name) BETWEEN 1 AND 120),
  normalized_brewery TEXT NOT NULL,
  normalized_beer_name TEXT NOT NULL,
  style TEXT NOT NULL CHECK (style IN ('marzen', 'festbier')),
  package_type TEXT NOT NULL CHECK (package_type IN ('six_pack_bottles', 'four_pack_cans')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_signups_normalized_beer
ON signups (normalized_brewery, normalized_beer_name);

PRAGMA optimize;
