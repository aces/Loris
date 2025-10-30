SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE dataquery_query_names WRITE;
TRUNCATE TABLE dataquery_query_names;
LOAD DATA LOCAL INFILE 'dataquery_query_names.tsv' INTO TABLE dataquery_query_names
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
