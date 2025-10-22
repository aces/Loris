SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_event_file WRITE;
TRUNCATE TABLE physiological_event_file;
LOAD DATA LOCAL INFILE 'physiological_event_file.tsv' INTO TABLE physiological_event_file
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
