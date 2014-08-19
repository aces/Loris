ALTER TABLE users MODIFY Pending_approval enum('Y','N') DEFAULT 'Y';
UPDATE users SET Pending_approval='N';
