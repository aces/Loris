SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE electrophysiology_uploader WRITE;
TRUNCATE TABLE electrophysiology_uploader;
LOAD DATA LOCAL INFILE 'electrophysiology_uploader.tsv' INTO TABLE electrophysiology_uploader
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
