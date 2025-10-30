SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE dataquery_run_queries WRITE;
TRUNCATE TABLE dataquery_run_queries;
LOAD DATA LOCAL INFILE 'dataquery_run_queries.tsv' INTO TABLE dataquery_run_queries
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
