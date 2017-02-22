GRANT UPDATE,INSERT,SELECT,DELETE,DROP,CREATE TEMPORARY TABLES ON LorisTest.* TO 'SQLTestUser'@'%' IDENTIFIED BY 'TestPassword' WITH GRANT OPTION;
UPDATE users SET Password_MD5=CONCAT('aa', MD5('aatestpass')), Pending_approval='N', Password_expiry='2100-01-01' WHERE ID=1;
