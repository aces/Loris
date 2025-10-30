SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE publication_test_names_rel WRITE;
TRUNCATE TABLE publication_test_names_rel;
LOAD DATA LOCAL INFILE 'publication_test_names_rel.tsv' INTO TABLE publication_test_names_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
