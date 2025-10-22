SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_task_event_opt;
LOCK TABLE physiological_task_event_opt WRITE;
LOAD DATA LOCAL INFILE 'physiological_task_event_opt.tsv' INTO TABLE physiological_task_event_opt
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
