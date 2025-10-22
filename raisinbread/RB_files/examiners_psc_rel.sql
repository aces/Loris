SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE examiners_psc_rel WRITE;
TRUNCATE TABLE examiners_psc_rel;
LOAD DATA LOCAL INFILE 'examiners_psc_rel.tsv' INTO TABLE examiners_psc_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
