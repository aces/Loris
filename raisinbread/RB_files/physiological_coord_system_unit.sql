SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_coord_system_unit;
LOCK TABLE physiological_coord_system_unit WRITE;
LOAD DATA LOCAL INFILE 'physiological_coord_system_unit.tsv' INTO TABLE physiological_coord_system_unit
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
