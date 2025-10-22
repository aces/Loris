SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_channel WRITE;
TRUNCATE TABLE physiological_channel;
LOAD DATA LOCAL INFILE 'physiological_channel.tsv' INTO TABLE physiological_channel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
