SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE parameter_type_category;
LOCK TABLE parameter_type_category WRITE;
LOAD DATA LOCAL INFILE 'parameter_type_category.tsv' INTO TABLE parameter_type_category
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
