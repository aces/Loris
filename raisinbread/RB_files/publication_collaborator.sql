SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE publication_collaborator;
LOCK TABLE publication_collaborator WRITE;
LOAD DATA LOCAL INFILE 'publication_collaborator.tsv' INTO TABLE publication_collaborator
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
