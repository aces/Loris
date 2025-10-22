SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE permissions_category;
LOCK TABLE permissions_category WRITE;
LOAD DATA LOCAL INFILE 'permissions_category.tsv' INTO TABLE permissions_category
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
