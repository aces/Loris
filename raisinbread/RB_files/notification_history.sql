SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE notification_history WRITE;
TRUNCATE TABLE notification_history;
LOAD DATA LOCAL INFILE 'notification_history.tsv' INTO TABLE notification_history
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
