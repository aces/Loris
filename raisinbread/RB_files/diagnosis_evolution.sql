SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE diagnosis_evolution WRITE;
TRUNCATE TABLE diagnosis_evolution;
LOAD DATA LOCAL INFILE 'diagnosis_evolution.tsv' INTO TABLE diagnosis_evolution
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
