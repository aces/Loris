SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE user_login_history;
LOCK TABLE user_login_history WRITE;
LOAD DATA LOCAL INFILE 'user_login_history.tsv' INTO TABLE user_login_history
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
