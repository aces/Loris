SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_electrode_material;
LOCK TABLE physiological_electrode_material WRITE;
LOAD DATA LOCAL INFILE 'physiological_electrode_material.tsv' INTO TABLE physiological_electrode_material
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
