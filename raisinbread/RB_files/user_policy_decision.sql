SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE user_policy_decision;
LOCK TABLE user_policy_decision WRITE;
LOAD DATA LOCAL INFILE 'user_policy_decision.tsv' INTO TABLE user_policy_decision
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
