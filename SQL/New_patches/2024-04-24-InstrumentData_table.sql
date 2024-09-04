CREATE TABLE `instrument_data` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`Data`)),
  PRIMARY KEY (`ID`)
);

-- we abuse the ID of the flag column for data migration
-- by making it the same as the id in the new table, even
-- though they're different primary keys
INSERT INTO instrument_data SELECT ID, Data FROM flag WHERE Data IS NOT NULL;

ALTER TABLE flag ADD COLUMN DataID int(10) unsigned;
ALTER TABLE flag ADD FOREIGN KEY (DataID) REFERENCES instrument_data(ID);

-- from this point forward they won't necessarily be the same id, but we don't
-- care anymore now that the data is migrated and foreign keys were enforced
UPDATE flag SET DataID=ID WHERE Data IS NOT NULL;

-- FIXME: Put in a cleanup patch
-- ALTER TABLE flag DROP COLUMN Data;
-- Reclaim the space that was used by the column
-- OPTIMIZE TABLE flag;
