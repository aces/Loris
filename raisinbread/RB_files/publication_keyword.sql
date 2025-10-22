SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE publication_keyword WRITE;
TRUNCATE TABLE publication_keyword;
LOAD DATA LOCAL INFILE 'publication_keyword.tsv' INTO TABLE publication_keyword
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
