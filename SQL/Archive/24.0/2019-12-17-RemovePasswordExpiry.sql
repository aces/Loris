ALTER TABLE users ADD COLUMN PasswordChangeRequired TINYINT(1) NOT NULL DEFAULT 0;
UPDATE users SET PasswordChangeRequired=1 WHERE Password_expiry < CURDATE();
ALTER TABLE users DROP COLUMN Password_expiry;
