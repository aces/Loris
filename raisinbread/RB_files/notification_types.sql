SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE notification_types WRITE;
TRUNCATE TABLE notification_types;
LOAD DATA LOCAL INFILE 'notification_types.tsv' INTO TABLE notification_types
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
