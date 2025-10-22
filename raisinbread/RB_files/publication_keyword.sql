SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE publication_keyword;
LOCK TABLE publication_keyword WRITE;
LOAD DATA LOCAL INFILE 'publication_keyword.tsv' INTO TABLE publication_keyword
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
