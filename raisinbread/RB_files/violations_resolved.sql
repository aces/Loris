SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE violations_resolved WRITE;
TRUNCATE TABLE violations_resolved;
LOAD DATA LOCAL INFILE 'violations_resolved.tsv' INTO TABLE violations_resolved
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
