SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_event_file;
LOCK TABLE physiological_event_file WRITE;
LOAD DATA LOCAL INFILE 'physiological_event_file.tsv' INTO TABLE physiological_event_file
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
