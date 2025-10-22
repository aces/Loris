SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_coord_system_point_3d_rel;
LOCK TABLE physiological_coord_system_point_3d_rel WRITE;
LOAD DATA LOCAL INFILE 'physiological_coord_system_point_3d_rel.tsv' INTO TABLE physiological_coord_system_point_3d_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
