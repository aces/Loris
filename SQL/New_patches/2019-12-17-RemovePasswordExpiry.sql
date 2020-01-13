ALTER TABLE users ADD COLUMN Password_expired TINYINT(1) NOT NULL DEFAULT 0;
UPDATE users SET Password_expired=1 WHERE Password_expiry < CURDATE();
ALTER TABLE users DROP COLUMN Password_expiry;
