SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE permissions_action WRITE;
TRUNCATE TABLE permissions_action;
LOAD DATA LOCAL INFILE 'permissions_action.tsv' INTO TABLE permissions_action
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
