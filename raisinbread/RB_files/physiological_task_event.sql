SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_task_event;
LOCK TABLE physiological_task_event WRITE;
LOAD DATA LOCAL INFILE 'physiological_task_event.tsv' INTO TABLE physiological_task_event
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
