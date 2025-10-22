SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE participant_status;
LOCK TABLE participant_status WRITE;
LOAD DATA LOCAL INFILE 'participant_status.tsv' INTO TABLE participant_status
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
