SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE participant_status WRITE;
TRUNCATE TABLE participant_status;
LOAD DATA LOCAL INFILE 'participant_status.tsv' INTO TABLE participant_status
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
