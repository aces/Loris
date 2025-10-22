SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE candidate_consent_history;
LOCK TABLE candidate_consent_history WRITE;
LOAD DATA LOCAL INFILE 'candidate_consent_history.tsv' INTO TABLE candidate_consent_history
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
