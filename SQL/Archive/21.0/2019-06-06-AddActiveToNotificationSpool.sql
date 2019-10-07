-- ----------------------------------------------------------------------------------------------
--
-- Adds the Active column to the notification spool table. Active log entries refer to the 
-- entries of the last upload associated to a given upload ID. The entries that belong to 
-- previous uploads will have their Active column set to 'N'.
--
-- ----------------------------------------------------------------------------------------------

ALTER TABLE notification_spool ADD COLUMN Active enum('Y', 'N') NOT NULL DEFAULT 'Y' AFTER Origin;
