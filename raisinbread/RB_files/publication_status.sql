SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE publication_status;
LOCK TABLE publication_status WRITE;
LOAD DATA LOCAL INFILE 'publication_status.tsv' INTO TABLE publication_status
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
