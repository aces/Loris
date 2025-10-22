SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE parameter_candidate;
LOCK TABLE parameter_candidate WRITE;
LOAD DATA LOCAL INFILE 'parameter_candidate.tsv' INTO TABLE parameter_candidate
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
