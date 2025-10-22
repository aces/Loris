SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE notification_spool WRITE;
TRUNCATE TABLE notification_spool;
LOAD DATA LOCAL INFILE 'notification_spool.tsv' INTO TABLE notification_spool
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
