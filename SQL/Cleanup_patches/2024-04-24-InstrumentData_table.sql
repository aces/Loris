
ALTER TABLE flag DROP COLUMN Data;
-- Reclaim the space that was used by the column
OPTIMIZE TABLE flag;
