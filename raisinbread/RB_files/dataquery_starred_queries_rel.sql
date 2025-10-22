SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE dataquery_starred_queries_rel WRITE;
TRUNCATE TABLE dataquery_starred_queries_rel;
LOAD DATA LOCAL INFILE 'dataquery_starred_queries_rel.tsv' INTO TABLE dataquery_starred_queries_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
