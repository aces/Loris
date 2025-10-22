SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE publication_upload_type;
LOCK TABLE publication_upload_type WRITE;
LOAD DATA LOCAL INFILE 'publication_upload_type.tsv' INTO TABLE publication_upload_type
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
