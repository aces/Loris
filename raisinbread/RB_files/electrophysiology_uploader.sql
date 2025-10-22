SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE electrophysiology_uploader;
LOCK TABLE electrophysiology_uploader WRITE;
LOAD DATA LOCAL INFILE 'electrophysiology_uploader.tsv' INTO TABLE electrophysiology_uploader
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
