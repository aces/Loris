SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE dataquery_query_names;
LOCK TABLE dataquery_query_names WRITE;
LOAD DATA LOCAL INFILE 'dataquery_query_names.tsv' INTO TABLE dataquery_query_names
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
