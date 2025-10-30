SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE user_policy_decision WRITE;
TRUNCATE TABLE user_policy_decision;
LOAD DATA LOCAL INFILE 'user_policy_decision.tsv' INTO TABLE user_policy_decision
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
