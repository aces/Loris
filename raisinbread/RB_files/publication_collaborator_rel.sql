SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE publication_collaborator_rel;
LOCK TABLE publication_collaborator_rel WRITE;
LOAD DATA LOCAL INFILE 'publication_collaborator_rel.tsv' INTO TABLE publication_collaborator_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
