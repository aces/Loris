SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE dataquery_queries;
LOCK TABLE dataquery_queries WRITE;
LOAD DATA LOCAL INFILE 'dataquery_queries.tsv' INTO TABLE dataquery_queries
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
