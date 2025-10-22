SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE certification_history;
LOCK TABLE certification_history WRITE;
LOAD DATA LOCAL INFILE 'certification_history.tsv' INTO TABLE certification_history
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
