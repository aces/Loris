SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE files_intermediary WRITE;
TRUNCATE TABLE files_intermediary;
LOAD DATA LOCAL INFILE 'files_intermediary.tsv' INTO TABLE files_intermediary
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
