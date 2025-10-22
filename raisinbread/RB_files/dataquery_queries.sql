SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE dataquery_queries WRITE;
TRUNCATE TABLE dataquery_queries;
LOAD DATA LOCAL INFILE 'dataquery_queries.tsv' INTO TABLE dataquery_queries
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
