SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE participant_status_history WRITE;
TRUNCATE TABLE participant_status_history;
LOAD DATA LOCAL INFILE 'participant_status_history.tsv' INTO TABLE participant_status_history
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
