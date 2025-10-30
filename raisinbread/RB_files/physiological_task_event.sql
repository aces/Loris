SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_task_event WRITE;
TRUNCATE TABLE physiological_task_event;
LOAD DATA LOCAL INFILE 'physiological_task_event.tsv' INTO TABLE physiological_task_event
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
