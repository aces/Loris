SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE publication_upload WRITE;
TRUNCATE TABLE publication_upload;
LOAD DATA LOCAL INFILE 'publication_upload.tsv' INTO TABLE publication_upload
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
