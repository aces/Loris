SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE parameter_type_category_rel;
LOCK TABLE parameter_type_category_rel WRITE;
LOAD DATA LOCAL INFILE 'parameter_type_category_rel.tsv' INTO TABLE parameter_type_category_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
