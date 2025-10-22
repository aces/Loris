SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE permissions_action;
LOCK TABLE permissions_action WRITE;
LOAD DATA LOCAL INFILE 'permissions_action.tsv' INTO TABLE permissions_action
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
