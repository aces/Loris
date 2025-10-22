SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_coord_system;
LOCK TABLE physiological_coord_system WRITE;
LOAD DATA LOCAL INFILE 'physiological_coord_system.tsv' INTO TABLE physiological_coord_system
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
