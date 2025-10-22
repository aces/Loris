SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE participant_emails;
LOCK TABLE participant_emails WRITE;
LOAD DATA LOCAL INFILE 'participant_emails.tsv' INTO TABLE participant_emails
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
