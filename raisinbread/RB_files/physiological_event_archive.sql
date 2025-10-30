SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_event_archive WRITE;
TRUNCATE TABLE physiological_event_archive;
LOAD DATA LOCAL INFILE 'physiological_event_archive.tsv' INTO TABLE physiological_event_archive
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
