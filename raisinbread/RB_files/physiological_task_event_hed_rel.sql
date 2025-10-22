SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_task_event_hed_rel;
LOCK TABLE physiological_task_event_hed_rel WRITE;
LOAD DATA LOCAL INFILE 'physiological_task_event_hed_rel.tsv' INTO TABLE physiological_task_event_hed_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
