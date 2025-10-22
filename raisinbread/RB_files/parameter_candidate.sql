SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE parameter_candidate WRITE;
TRUNCATE TABLE parameter_candidate;
LOAD DATA LOCAL INFILE 'parameter_candidate.tsv' INTO TABLE parameter_candidate
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
