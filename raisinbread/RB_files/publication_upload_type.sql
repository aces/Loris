SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE publication_upload_type WRITE;
TRUNCATE TABLE publication_upload_type;
LOAD DATA LOCAL INFILE 'publication_upload_type.tsv' INTO TABLE publication_upload_type
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
