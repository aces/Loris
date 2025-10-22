SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE data_release_permissions;
LOCK TABLE data_release_permissions WRITE;
LOAD DATA LOCAL INFILE 'data_release_permissions.tsv' INTO TABLE data_release_permissions
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
