SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_electrode_type;
LOCK TABLE physiological_electrode_type WRITE;
LOAD DATA LOCAL INFILE 'physiological_electrode_type.tsv' INTO TABLE physiological_electrode_type
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
