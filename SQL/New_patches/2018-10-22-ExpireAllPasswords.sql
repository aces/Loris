-- This forces a password reset for all users the next time they login. Before
-- this patch, all passwords changed by the front-end were stored in plaintext.
UPDATE users SET Password_expiry='1990-01-01';
