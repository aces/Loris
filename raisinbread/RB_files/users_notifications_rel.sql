SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE users_notifications_rel;
LOCK TABLE users_notifications_rel WRITE;
LOAD DATA LOCAL INFILE 'users_notifications_rel.tsv' INTO TABLE users_notifications_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
