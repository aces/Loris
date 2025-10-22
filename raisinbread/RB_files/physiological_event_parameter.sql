SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_event_parameter WRITE;
TRUNCATE TABLE physiological_event_parameter;
LOAD DATA LOCAL INFILE 'physiological_event_parameter.tsv' INTO TABLE physiological_event_parameter
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
