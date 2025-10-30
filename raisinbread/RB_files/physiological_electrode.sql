SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_electrode WRITE;
TRUNCATE TABLE physiological_electrode;
LOAD DATA LOCAL INFILE 'physiological_electrode.tsv' INTO TABLE physiological_electrode
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
