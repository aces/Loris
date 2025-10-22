SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_output_type;
LOCK TABLE physiological_output_type WRITE;
LOAD DATA LOCAL INFILE 'physiological_output_type.tsv' INTO TABLE physiological_output_type
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
