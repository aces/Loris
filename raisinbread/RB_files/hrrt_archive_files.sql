SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE hrrt_archive_files WRITE;
TRUNCATE TABLE hrrt_archive_files;
LOAD DATA LOCAL INFILE 'hrrt_archive_files.tsv' INTO TABLE hrrt_archive_files
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
