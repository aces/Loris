SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_electrode;
LOCK TABLE physiological_electrode WRITE;
LOAD DATA LOCAL INFILE 'physiological_electrode.tsv' INTO TABLE physiological_electrode
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
