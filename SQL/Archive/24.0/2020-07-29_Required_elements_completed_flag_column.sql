ALTER TABLE flag
    ADD COLUMN `Required_elements_completed` enum('Y','N') NOT NULL default 'N';
