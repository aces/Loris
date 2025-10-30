SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE parameter_session WRITE;
TRUNCATE TABLE parameter_session;
LOAD DATA LOCAL INFILE 'parameter_session.tsv' INTO TABLE parameter_session
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
