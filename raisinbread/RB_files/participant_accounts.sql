SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE participant_accounts;
LOCK TABLE participant_accounts WRITE;
LOAD DATA LOCAL INFILE 'participant_accounts.tsv' INTO TABLE participant_accounts
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
