-- This forces a password reset for all users the next time they login. Before
-- this patch, all passwords changed by the front-end were stored in plaintext.
UPDATE users SET Password_expiry='1990-01-01';
-- Remove old plaintext passwords. Also affects old history entries when the
-- column was named `hash` instead of `Password_hash`
DELETE FROM history WHERE col LIKE "%hash%" AND tbl='users';
