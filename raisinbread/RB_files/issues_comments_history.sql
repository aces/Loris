SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE issues_comments_history WRITE;
TRUNCATE TABLE issues_comments_history;
LOAD DATA LOCAL INFILE 'issues_comments_history.tsv' INTO TABLE issues_comments_history
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
