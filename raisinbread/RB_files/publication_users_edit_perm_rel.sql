SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE publication_users_edit_perm_rel;
LOCK TABLE publication_users_edit_perm_rel WRITE;
LOAD DATA LOCAL INFILE 'publication_users_edit_perm_rel.tsv' INTO TABLE publication_users_edit_perm_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
