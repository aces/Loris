SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE parameter_type_category_rel WRITE;
TRUNCATE TABLE parameter_type_category_rel;
LOAD DATA LOCAL INFILE 'parameter_type_category_rel.tsv' INTO TABLE parameter_type_category_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
