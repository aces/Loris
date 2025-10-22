SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_archive;
LOCK TABLE physiological_archive WRITE;
LOAD DATA LOCAL INFILE 'physiological_archive.tsv' INTO TABLE physiological_archive
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
