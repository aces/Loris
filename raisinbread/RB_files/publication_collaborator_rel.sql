SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE publication_collaborator_rel WRITE;
TRUNCATE TABLE publication_collaborator_rel;
LOAD DATA LOCAL INFILE 'publication_collaborator_rel.tsv' INTO TABLE publication_collaborator_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
