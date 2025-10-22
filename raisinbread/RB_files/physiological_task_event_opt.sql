SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_task_event_opt WRITE;
TRUNCATE TABLE physiological_task_event_opt;
LOAD DATA LOCAL INFILE 'physiological_task_event_opt.tsv' INTO TABLE physiological_task_event_opt
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
