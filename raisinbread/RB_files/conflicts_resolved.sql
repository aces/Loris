SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE conflicts_resolved WRITE;
TRUNCATE TABLE conflicts_resolved;
LOAD DATA LOCAL INFILE 'conflicts_resolved.tsv' INTO TABLE conflicts_resolved
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
