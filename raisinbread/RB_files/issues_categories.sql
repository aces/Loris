SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE issues_categories WRITE;
TRUNCATE TABLE issues_categories;
LOAD DATA LOCAL INFILE 'issues_categories.tsv' INTO TABLE issues_categories
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
