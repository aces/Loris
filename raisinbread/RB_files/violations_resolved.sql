SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE violations_resolved;
LOCK TABLE violations_resolved WRITE;
LOAD DATA LOCAL INFILE 'violations_resolved.tsv' INTO TABLE violations_resolved
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
