SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE participant_accounts WRITE;
TRUNCATE TABLE participant_accounts;
LOAD DATA LOCAL INFILE 'participant_accounts.tsv' INTO TABLE participant_accounts
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
