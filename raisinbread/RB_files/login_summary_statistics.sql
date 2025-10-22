SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE login_summary_statistics;
LOCK TABLE login_summary_statistics WRITE;
LOAD DATA LOCAL INFILE 'login_summary_statistics.tsv' INTO TABLE login_summary_statistics
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
