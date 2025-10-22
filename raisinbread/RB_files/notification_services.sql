SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE notification_services;
LOCK TABLE notification_services WRITE;
LOAD DATA LOCAL INFILE 'notification_services.tsv' INTO TABLE notification_services
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
