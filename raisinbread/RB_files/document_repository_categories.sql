SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE document_repository_categories WRITE;
TRUNCATE TABLE document_repository_categories;
LOAD DATA LOCAL INFILE 'document_repository_categories.tsv' INTO TABLE document_repository_categories
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
