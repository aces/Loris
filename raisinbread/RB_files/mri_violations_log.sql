SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE mri_violations_log WRITE;
TRUNCATE TABLE mri_violations_log;
LOAD DATA LOCAL INFILE 'mri_violations_log.tsv' INTO TABLE mri_violations_log
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
