SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE candidate_consent_history WRITE;
TRUNCATE TABLE candidate_consent_history;
LOAD DATA LOCAL INFILE 'candidate_consent_history.tsv' INTO TABLE candidate_consent_history
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
