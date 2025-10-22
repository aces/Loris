SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE candidate_consent_rel;
LOCK TABLE candidate_consent_rel WRITE;
LOAD DATA LOCAL INFILE 'candidate_consent_rel.tsv' INTO TABLE candidate_consent_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
