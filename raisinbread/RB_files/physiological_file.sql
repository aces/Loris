SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_file WRITE;
TRUNCATE TABLE physiological_file;
LOAD DATA LOCAL INFILE 'physiological_file.tsv' INTO TABLE physiological_file
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
