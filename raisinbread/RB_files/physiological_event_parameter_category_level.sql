SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_event_parameter_category_level WRITE;
TRUNCATE TABLE physiological_event_parameter_category_level;
LOAD DATA LOCAL INFILE 'physiological_event_parameter_category_level.tsv' INTO TABLE physiological_event_parameter_category_level
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
