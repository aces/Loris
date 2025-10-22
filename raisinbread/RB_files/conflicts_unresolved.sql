SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE conflicts_unresolved WRITE;
TRUNCATE TABLE conflicts_unresolved;
LOAD DATA LOCAL INFILE 'conflicts_unresolved.tsv' INTO TABLE conflicts_unresolved
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
