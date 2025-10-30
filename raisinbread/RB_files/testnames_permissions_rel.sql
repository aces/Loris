SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE testnames_permissions_rel WRITE;
TRUNCATE TABLE testnames_permissions_rel;
LOAD DATA LOCAL INFILE 'testnames_permissions_rel.tsv' INTO TABLE testnames_permissions_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
