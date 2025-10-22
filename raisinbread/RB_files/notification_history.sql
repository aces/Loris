SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE notification_history;
LOCK TABLE notification_history WRITE;
LOAD DATA LOCAL INFILE 'notification_history.tsv' INTO TABLE notification_history
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
