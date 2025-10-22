SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_parameter_file;
LOCK TABLE physiological_parameter_file WRITE;
LOAD DATA LOCAL INFILE 'physiological_parameter_file.tsv' INTO TABLE physiological_parameter_file
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
