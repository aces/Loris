SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE users_notifications_rel WRITE;
TRUNCATE TABLE users_notifications_rel;
LOAD DATA LOCAL INFILE 'users_notifications_rel.tsv' INTO TABLE users_notifications_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
