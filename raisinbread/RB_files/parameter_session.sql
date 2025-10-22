SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE parameter_session;
LOCK TABLE parameter_session WRITE;
LOAD DATA LOCAL INFILE 'parameter_session.tsv' INTO TABLE parameter_session
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
