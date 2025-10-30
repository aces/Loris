SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE permissions_category WRITE;
TRUNCATE TABLE permissions_category;
LOAD DATA LOCAL INFILE 'permissions_category.tsv' INTO TABLE permissions_category
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
