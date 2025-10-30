SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE participant_status_options WRITE;
TRUNCATE TABLE participant_status_options;
LOAD DATA LOCAL INFILE 'participant_status_options.tsv' INTO TABLE participant_status_options
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
