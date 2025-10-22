SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE notification_modules;
LOCK TABLE notification_modules WRITE;
LOAD DATA LOCAL INFILE 'notification_modules.tsv' INTO TABLE notification_modules
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
