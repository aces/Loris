SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_coord_system_type;
LOCK TABLE physiological_coord_system_type WRITE;
LOAD DATA LOCAL INFILE 'physiological_coord_system_type.tsv' INTO TABLE physiological_coord_system_type
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
