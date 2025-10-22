SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE participant_status_history;
LOCK TABLE participant_status_history WRITE;
LOAD DATA LOCAL INFILE 'participant_status_history.tsv' INTO TABLE participant_status_history
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
