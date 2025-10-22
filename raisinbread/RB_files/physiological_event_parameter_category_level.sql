SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_event_parameter_category_level;
LOCK TABLE physiological_event_parameter_category_level WRITE;
LOAD DATA LOCAL INFILE 'physiological_event_parameter_category_level.tsv' INTO TABLE physiological_event_parameter_category_level
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
