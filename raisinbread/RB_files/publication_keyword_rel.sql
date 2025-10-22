SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE publication_keyword_rel;
LOCK TABLE publication_keyword_rel WRITE;
LOAD DATA LOCAL INFILE 'publication_keyword_rel.tsv' INTO TABLE publication_keyword_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
