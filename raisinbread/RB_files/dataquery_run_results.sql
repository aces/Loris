SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE dataquery_run_results;
LOCK TABLE dataquery_run_results WRITE;
LOAD DATA LOCAL INFILE 'dataquery_run_results.tsv' INTO TABLE dataquery_run_results
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
