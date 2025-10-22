SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE conflicts_unresolved;
LOCK TABLE conflicts_unresolved WRITE;
LOAD DATA LOCAL INFILE 'conflicts_unresolved.tsv' INTO TABLE conflicts_unresolved
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
