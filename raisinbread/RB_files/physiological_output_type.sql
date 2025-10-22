SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_output_type WRITE;
TRUNCATE TABLE physiological_output_type;
LOAD DATA LOCAL INFILE 'physiological_output_type.tsv' INTO TABLE physiological_output_type
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
