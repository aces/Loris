ALTER TABLE examiners ADD COLUMN `active` enum('Y','N') NOT NULL DEFAULT 'Y';
ALTER TABLE examiners ADD COLUMN `pending_approval` enum('Y','N') NOT NULL DEFAULT 'N';
