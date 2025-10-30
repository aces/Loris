SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE notification_services WRITE;
TRUNCATE TABLE notification_services;
LOAD DATA LOCAL INFILE 'notification_services.tsv' INTO TABLE notification_services
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
