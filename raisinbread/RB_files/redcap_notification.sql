SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE redcap_notification WRITE;
TRUNCATE TABLE redcap_notification;
LOAD DATA LOCAL INFILE 'redcap_notification.tsv' INTO TABLE redcap_notification
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
