SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE user_account_history WRITE;
TRUNCATE TABLE user_account_history;
LOAD DATA LOCAL INFILE 'user_account_history.tsv' INTO TABLE user_account_history
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
