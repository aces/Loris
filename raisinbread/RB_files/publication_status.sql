SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE publication_status WRITE;
TRUNCATE TABLE publication_status;
LOAD DATA LOCAL INFILE 'publication_status.tsv' INTO TABLE publication_status
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
