SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE files_intermediary;
LOCK TABLE files_intermediary WRITE;
LOAD DATA LOCAL INFILE 'files_intermediary.tsv' INTO TABLE files_intermediary
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
