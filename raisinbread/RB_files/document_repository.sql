SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE document_repository WRITE;
TRUNCATE TABLE document_repository;
LOAD DATA LOCAL INFILE 'document_repository.tsv' INTO TABLE document_repository
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
