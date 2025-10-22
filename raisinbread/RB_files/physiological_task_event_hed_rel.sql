SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_task_event_hed_rel WRITE;
TRUNCATE TABLE physiological_task_event_hed_rel;
LOAD DATA LOCAL INFILE 'physiological_task_event_hed_rel.tsv' INTO TABLE physiological_task_event_hed_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
