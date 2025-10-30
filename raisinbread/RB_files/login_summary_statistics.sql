SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE login_summary_statistics WRITE;
TRUNCATE TABLE login_summary_statistics;
LOAD DATA LOCAL INFILE 'login_summary_statistics.tsv' INTO TABLE login_summary_statistics
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
