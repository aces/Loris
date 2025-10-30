SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_channel_type WRITE;
TRUNCATE TABLE physiological_channel_type;
LOAD DATA LOCAL INFILE 'physiological_channel_type.tsv' INTO TABLE physiological_channel_type
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
