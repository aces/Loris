SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_coord_system WRITE;
TRUNCATE TABLE physiological_coord_system;
LOAD DATA LOCAL INFILE 'physiological_coord_system.tsv' INTO TABLE physiological_coord_system
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
