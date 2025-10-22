SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE diagnosis_evolution;
LOCK TABLE diagnosis_evolution WRITE;
LOAD DATA LOCAL INFILE 'diagnosis_evolution.tsv' INTO TABLE diagnosis_evolution
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
