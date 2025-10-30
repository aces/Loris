SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE participant_emails WRITE;
TRUNCATE TABLE participant_emails;
LOAD DATA LOCAL INFILE 'participant_emails.tsv' INTO TABLE participant_emails
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
