SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_coord_system_electrode_rel WRITE;
TRUNCATE TABLE physiological_coord_system_electrode_rel;
LOAD DATA LOCAL INFILE 'physiological_coord_system_electrode_rel.tsv' INTO TABLE physiological_coord_system_electrode_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
