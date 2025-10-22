SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE notification_modules_services_rel;
LOCK TABLE notification_modules_services_rel WRITE;
LOAD DATA LOCAL INFILE 'notification_modules_services_rel.tsv' INTO TABLE notification_modules_services_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
