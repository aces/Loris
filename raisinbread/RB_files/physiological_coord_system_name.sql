SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_coord_system_name;
LOCK TABLE physiological_coord_system_name WRITE;
LOAD DATA LOCAL INFILE 'physiological_coord_system_name.tsv' INTO TABLE physiological_coord_system_name
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
