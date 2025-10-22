SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE dataquery_study_queries_rel;
LOCK TABLE dataquery_study_queries_rel WRITE;
LOAD DATA LOCAL INFILE 'dataquery_study_queries_rel.tsv' INTO TABLE dataquery_study_queries_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
