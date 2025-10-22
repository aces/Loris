SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_status_type;
LOCK TABLE physiological_status_type WRITE;
LOAD DATA LOCAL INFILE 'physiological_status_type.tsv' INTO TABLE physiological_status_type
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
