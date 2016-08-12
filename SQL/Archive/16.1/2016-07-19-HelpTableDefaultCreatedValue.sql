-- It would be preferable to run this UPDATE statement if your mysql server version is < 5.7
-- UPDATE help SET created = '2014-09-01 00:00:00' WHERE created = '0000-00-00 00:00:00';
ALTER TABLE help CHANGE `created` `created` DATETIME DEFAULT NULL;
ALTER TABLE help CHANGE `updated` `updated` DATETIME DEFAULT NULL;
