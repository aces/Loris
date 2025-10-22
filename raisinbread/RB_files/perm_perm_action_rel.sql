SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE perm_perm_action_rel WRITE;
TRUNCATE TABLE perm_perm_action_rel;
LOAD DATA LOCAL INFILE 'perm_perm_action_rel.tsv' INTO TABLE perm_perm_action_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
