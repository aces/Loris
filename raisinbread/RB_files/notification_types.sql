SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE notification_types;
LOCK TABLE notification_types WRITE;
LOAD DATA LOCAL INFILE 'notification_types.tsv' INTO TABLE notification_types
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
