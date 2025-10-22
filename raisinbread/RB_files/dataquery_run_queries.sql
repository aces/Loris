SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE dataquery_run_queries;
LOCK TABLE dataquery_run_queries WRITE;
LOAD DATA LOCAL INFILE 'dataquery_run_queries.tsv' INTO TABLE dataquery_run_queries
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
