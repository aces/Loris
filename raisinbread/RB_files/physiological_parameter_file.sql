SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_parameter_file WRITE;
TRUNCATE TABLE physiological_parameter_file;
LOAD DATA LOCAL INFILE 'physiological_parameter_file.tsv' INTO TABLE physiological_parameter_file
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
