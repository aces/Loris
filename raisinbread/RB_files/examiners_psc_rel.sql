SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE examiners_psc_rel;
LOCK TABLE examiners_psc_rel WRITE;
LOAD DATA LOCAL INFILE 'examiners_psc_rel.tsv' INTO TABLE examiners_psc_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
